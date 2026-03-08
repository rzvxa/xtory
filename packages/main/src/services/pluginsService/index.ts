import { readFile, writeFile } from 'fs/promises';
import { fsUtils } from 'main/utils';
import { ProjectMessageBroker } from 'main/project/projectMessageBroker';
import project from 'main/project';

import {
  ChannelsRenderer,
  LogLevel,
  FileTypeMap,
  sanitizePath,
  tryGetAsync,
} from '@xtory/shared';
import {
  PluginConfig,
  PluginEntry,
  PluginManifest,
} from '@xtory/shared/types/plugin';
import { spawn } from 'child_process';
import { ensureDir } from 'fs-extra';
import * as NodePath from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import type { IService } from 'packages/plugin-api';

import PluginApi, { PLUGIN_API_VERSION } from './pluginApi';

class PluginsService implements IService {
  #messageBroker: ProjectMessageBroker;

  readonly #pluginsFolder: string;

  #plugins: { [name: string]: PluginConfig };

  #pluginPaths: { [name: string]: string };

  #fileTypes: FileTypeMap;

  #foreignServices: Record<string, IService> = {};

  getForeignService(name: string): IService | null {
    return this.#foreignServices[name] ?? null;
  }

  constructor(pluginsFolder: string, messageBroker: ProjectMessageBroker) {
    this.#messageBroker = messageBroker;
    this.#pluginsFolder = sanitizePath(pluginsFolder);
    this.#plugins = {};
    this.#pluginPaths = {};
    this.#fileTypes = {};
  }

  async init(skipStartMessage: boolean = false): Promise<boolean> {
    try {
      // Get plugin count
      const pluginCount = Object.keys(
        project.settingsService.get('plugins') ?? {}
      ).length;

      // Notify renderer that plugins are starting to load
      if (!skipStartMessage) {
        this.#messageBroker(
          ChannelsRenderer.onPluginsLoadingStart,
          pluginCount
        );
      }
      const loadedCount = await this.loadPlugins();
      await Promise.all(
        Object.values(this.#foreignServices).map((svc) => svc.init())
      );
      // Notify renderer that plugins finished loading with actual loaded count
      this.#messageBroker(
        ChannelsRenderer.onPluginsLoadingComplete,
        loadedCount
      );
      return true;
    } catch {
      // Notify renderer even on error with 0 loaded
      this.#messageBroker(ChannelsRenderer.onPluginsLoadingComplete, 0);
      return false;
    }
  }

  async loadPlugins(): Promise<number> {
    await this.#refreshPackageJson();
    await this.#npmCmd('install');

    const pluginsConfig =
      project.settingsService.get('pluginsConfiguration') || {};

    const plugins: Promise<readonly [string, string, PluginEntry | null]>[] =
      Object.entries(project.settingsService.get('plugins') ?? {})
        .filter(([pluginName]) => {
          // Check if plugin is enabled (default to true if not specified)
          const config = pluginsConfig[pluginName];
          return config?.enabled !== false;
        })
        .map(([key]) => key)
        .map(async (plugin) => {
          const pluginPath = `${this.#pluginsFolder}/node_modules/${plugin}`;
          return [
            plugin,
            pluginPath,
            await this.loadPlugin(pluginPath),
          ] as const;
        });

    const results = await Promise.all(plugins);

    await Promise.all(
      results
        .filter(([, , entry]) => !!entry)
        .map(([pluginName, pluginPath, entry]) =>
          this.#runMainScript(pluginName, pluginPath, entry!.mainFile)
        )
    );

    results
      .filter(([, , maybe]) => !maybe)
      .forEach(([plugin]) => {
        project.logger.error(`Failed to load ${plugin} plugin!`, [
          'plugin',
          plugin,
        ]);
      });

    // Send plugin entries to renderer for loading renderer-side code
    const pluginEntries = results
      .filter(([, , entry]) => !!entry)
      .map(([, , entry]) => entry!);

    this.#messageBroker(ChannelsRenderer.onLoadPlugins, pluginEntries);

    // Return the count of successfully loaded plugins
    return pluginEntries.length;
  }

  // eslint-disable-next-line class-methods-use-this
  async loadPlugin(pluginPath: string): Promise<PluginEntry | null> {
    const directoryName = pluginPath.split('/').pop() || '';
    const pluginPackageJsonPath = `${pluginPath}/package.json`;
    if (!(await fsUtils.exists(pluginPackageJsonPath))) {
      project.logger.error(
        `${directoryName} does not contain a "package.json" file at ${pluginPackageJsonPath}`,
        ['plugin', directoryName]
      );
      return null;
    }
    const pluginPackageJsonFileRead = await tryGetAsync<string>(() =>
      readFile(pluginPackageJsonPath, 'utf8')
    );
    if (!pluginPackageJsonFileRead.success) {
      return null;
    }
    const pluginPackageJson: PluginManifest = JSON.parse(
      pluginPackageJsonFileRead.result as string
    );
    const name = pluginPackageJson.name || directoryName;

    // Validate API version
    const pluginApiVersion = pluginPackageJson.yumeApiVersion;
    if (pluginApiVersion !== PLUGIN_API_VERSION) {
      project.logger.warning(
        `Plugin "${name}" uses API version ${pluginApiVersion}, but current API version is ${PLUGIN_API_VERSION}. This may cause compatibility issues.`,
        ['plugin', name]
      );
    }

    if (!pluginPackageJson.main) {
      project.logger.warning(
        `${name} plugin, does not have a main file in its "package.json"`,
        ['plugin', name]
      );
      return null;
    }
    const mainFile = pathToFileURL(
      NodePath.resolve(pluginPath, pluginPackageJson.main)
    ).toString();

    const rendererMainFile = pluginPackageJson.rendererMain
      ? pathToFileURL(
          NodePath.resolve(pluginPath, pluginPackageJson.rendererMain)
        ).toString()
      : undefined;

    return {
      packageJson: pluginPackageJson,
      mainFile,
      rendererMainFile,
    };
  }

  // TODO: consider better naming
  #makeFileTypePlugins() {
    const plugins = this.#plugins;

    const result: FileTypeMap = {};

    // Collect all FlowViews with their plugin key
    const allFlowViews: Array<{ pluginKey: string; fv: any }> = [];
    Object.entries(plugins).forEach(([key, plug]) => {
      plug.flowViews.forEach((fv) => {
        allFlowViews.push({ pluginKey: key, fv });
      });
    });

    // Separate non-optional and optional FlowViews
    const nonOptionalFlowViews = allFlowViews.filter(
      (item) => !item.fv.optional
    );
    const optionalFlowViews = allFlowViews.filter((item) => item.fv.optional);

    // Process non-optional FlowViews first to register file types
    const processFlowView = (pluginKey: string, fv: any) => {
      const existing = result[fv.fileType];

      if (!existing) {
        result[fv.fileType] = {
          fileType: fv.fileType,
          nodes: [...fv.nodes],
          menuItems: [...fv.menuItems],
        };
      } else {
        // merge nodes by type (last plugin wins on conflict)
        const mergedNodes = [...existing.nodes];
        fv.nodes.forEach((node: any) => {
          const index = mergedNodes.findIndex((n) => n.type === node.type);
          if (index === -1) {
            mergedNodes.push(node);
          } else {
            mergedNodes[index] = node;
          }
        });

        const mergedMenuItems = [...existing.menuItems, ...fv.menuItems];

        result[fv.fileType] = {
          fileType: fv.fileType,
          nodes: mergedNodes,
          menuItems: mergedMenuItems,
        };
      }

      fv.menuItems.forEach((menuItem: any) => {
        const pluginPath = this.#pluginPaths[pluginKey];
        const absoluteTemplatePath = NodePath.join(pluginPath, menuItem.data);
        this.#messageBroker(
          ChannelsRenderer.addFileMenuItem,
          menuItem.title,
          absoluteTemplatePath
        );
      });
    };

    // First, process all non-optional FlowViews
    nonOptionalFlowViews.forEach(({ pluginKey, fv }) => {
      processFlowView(pluginKey, fv);
    });

    // Process optional FlowViews in multiple passes to handle dependency chains
    // Keep processing until no more optional plugins can be registered
    let remainingOptionalFlowViews = [...optionalFlowViews];
    let previousCount = remainingOptionalFlowViews.length;
    let maxIterations = 10; // Safety limit to prevent infinite loops

    while (remainingOptionalFlowViews.length > 0 && maxIterations > 0) {
      const stillPending: typeof optionalFlowViews = [];

      remainingOptionalFlowViews.forEach(({ pluginKey, fv }) => {
        const existing = result[fv.fileType];

        // Skip optional FlowViews if the fileType doesn't exist yet
        if (!existing) {
          stillPending.push({ pluginKey, fv });
          return;
        }

        processFlowView(pluginKey, fv);
      });

      // If we didn't make any progress, break to avoid infinite loop
      if (stillPending.length === previousCount) {
        stillPending.forEach(({ pluginKey, fv }) => {
          project.logger.debug(
            `Skipping optional FlowView from ${pluginKey} for ${fv.fileType} - fileType not registered`,
            ['PluginsService']
          );
        });
        break;
      }

      remainingOptionalFlowViews = stillPending;
      previousCount = stillPending.length;
      maxIterations--;
    }

    this.#fileTypes = result;
  }

  getFileTypePlugins() {
    return this.#fileTypes;
  }

  // TODO: ideally this should be dropped in-favor of a more direct API,
  // does yarn support custom package.json/package-lock.json/node_modules names?
  // xtory.json should always be the source of truth and if we can avoid this intermediate it would be great
  async #refreshPackageJson(): Promise<void> {
    await ensureDir(this.#pluginsFolder);
    const plugins = project.settingsService.get('plugins');
    const pluginsPackageJsonPath = `${this.#pluginsFolder}/package.json`;
    const jsonContent = {
      name: `${
        project.settingsService.get('name') ?? 'Unnamed Project'
      }'s Plugins`,
      description: `This file is auto-generated at ${new Date().toUTCString()} from \`xtory.json\``,
      dependencies: plugins
        ? Object.fromEntries(
            Object.entries(plugins).map((entry) => {
              const [key, value] = entry;
              if (value.startsWith('file:')) {
                const path = value.slice('file:'.length);

                if (NodePath.isAbsolute(path)) {
                  return entry;
                }

                const resolvedPath = NodePath.resolve(project.path, path);
                return [
                  key,
                  `file:${NodePath.relative(
                    this.#pluginsFolder,
                    resolvedPath
                  )}`,
                ];
              }
              return entry;
            })
          )
        : {},
    };
    await writeFile(
      pluginsPackageJsonPath,
      JSON.stringify(jsonContent, null, 2),
      'utf8'
    );
  }

  async #npmCmd(
    cmd: 'install' | (string & {}),
    argv: Array<string> = [],
    stdio: 'process' | 'logger' | 'off' = 'logger'
  ): Promise<{ code: number; stdout: string; stderr: string }> {
    const child = spawn('npm', [cmd, ...argv], {
      shell: true,
      cwd: this.#pluginsFolder,
      stdio: ['ignore', 'pipe', 'pipe'], // we’ll handle piping manually
    });

    let stdout = '';
    let stderr = '';

    // forward & collect stdout
    child.stdout.setEncoding('utf8');
    child.stdout.on('data', (chunk) => {
      if (stdio === 'process') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        process.stdout.write(chunk);
      }
      stdout += chunk; // capture
    });

    // forward & collect stderr
    child.stderr.setEncoding('utf8');
    child.stderr.on('data', (chunk) => {
      if (stdio === 'process') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        process.stderr.write(chunk);
      }
      stderr += chunk; // capture
    });

    const code: number = await new Promise((resolve) => {
      child.on('exit', resolve);
    });

    if (stdio === 'logger') {
      if (stdout) {
        stdout
          .trimEnd()
          .split('\n')
          .map((it) => project.logger.info(it));
      }
      if (stderr) {
        stderr
          .trimEnd()
          .split('\n')
          .map((it) => project.logger.error(it));
      }
    }

    return { code, stdout: stdout.trimEnd(), stderr: stderr.trimEnd() };
  }

  async #runMainScript(
    pluginName: string,
    pluginPath: string,
    scriptPath: string
  ): Promise<void> {
    const context = {
      logger: project.logger,
      api: new PluginApi(),
    };
    const normalizedScriptPath = scriptPath.startsWith('file:')
      ? fileURLToPath(scriptPath)
      : scriptPath;

    try {
      project.logger.trace(
        `improting plugin main ${pluginName}(${normalizedScriptPath})`
      );
      const mod: { default?: unknown } = await import(normalizedScriptPath);
      if (typeof mod.default !== 'function') {
        throw new Error(
          `Invalid main script, it does not have a export default function ${normalizedScriptPath}`
        );
      }
      await mod.default(context);
      const { plugin, services } = context.api.build();
      this.#plugins[pluginName] = plugin;
      this.#pluginPaths[pluginName] = pluginPath;
      this.#foreignServices = {
        ...this.#foreignServices,
        ...Object.fromEntries(
          Object.entries(services).map(([key, val]) => [
            key,
            isClass(val) ? new val() : val(),
          ])
        ),
      };
      this.#makeFileTypePlugins();
    } catch (error) {
      project.logger.log(LogLevel.error, ['plugin', pluginName], error);
    }
  }
}

function isClass(maybeClass: any): maybeClass is new (...args: any[]) => any {
  if (typeof maybeClass !== 'function') {
    return false;
  }
  const source = Function.prototype.toString.call(maybeClass);
  return source.startsWith('class ');
}

export default PluginsService;
