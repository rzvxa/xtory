import { readFile, readdir } from 'fs/promises';
import { fsUtils } from 'main/utils';
import { ProjectMessageBroker } from 'main/project/projectMessageBroker';
import project from 'main/project';

import { LogLevel } from 'shared/types';
import { PluginConfig } from 'shared/types/plugin';
import { sanitizePath, tryGetAsync } from 'shared/utils';

import PluginApi from './pluginApi';

import IService from '../IService';

class PluginsService implements IService {
  #messageBroker: ProjectMessageBroker;

  #pluginsFolder: string;

  #plugins: { [name: string]: PluginConfig };

  constructor(pluginsFolder: string, messageBroker: ProjectMessageBroker) {
    this.#messageBroker = messageBroker;
    this.#pluginsFolder = sanitizePath(pluginsFolder);
    this.#plugins = {};
  }

  async init(): Promise<boolean> {
    try {
      await this.loadPlugins();
      return true;
    } catch (error) {
      return false;
    }
  }

  async loadPlugins(): Promise<void> {
    const plugins = (
      await readdir(this.#pluginsFolder, { withFileTypes: true })
    ).filter((dirent) => dirent.isDirectory());

    const promises: Promise<boolean>[] = [];
    for (let i = 0; i < plugins.length; ++i) {
      const pluginPath = `${this.#pluginsFolder}/${plugins[i].name}`;
      const promise = this.loadPlugin(pluginPath);
      promises.push(promise);
    }
    const results = await Promise.all(promises);
    results
      .filter((r) => !r)
      .forEach((_, index) => {
        project.logger.error(`Failed to load ${plugins[index].name} plugin!`, [
          'plugin',
          plugins[index].name,
        ]);
      });
  }

  async loadPlugin(pluginPath: string): Promise<boolean> {
    const directoryName = pluginPath.split('/').pop() || '';
    const manifestPath = `${pluginPath}/manifest.json`;
    if (!(await fsUtils.exists(manifestPath))) {
      project.logger.error(
        `${directoryName} does not contain a "manifest.json" file at ${manifestPath}`,
        ['plugin', directoryName]
      );
      return false;
    }
    const manifestFileRead = await tryGetAsync<string>(() =>
      readFile(manifestPath, 'utf8')
    );
    if (!manifestFileRead.success) {
      return false;
    }
    const manifest = JSON.parse(manifestFileRead.result as string);
    const name = manifest.name || directoryName;
    if (!manifest.main) {
      project.logger.warning(
        `${name} plugin, does not have a main file in its "manifest.json"`,
        ['plugin', name]
      );
      return false;
    }
    const mainPath = `${pluginPath}/${manifest.main}`;
    await this.#runMainScript(name, mainPath);
    return true;
  }

  // TODO: consider better naming
  getFileTypePlugins() {
    const plugins = this.#plugins;
    const result = Object.fromEntries(
      Object.entries(plugins)
        .filter((kv) => kv[1].flowView.fileType !== null)
        .map((kv) => [kv[1].flowView.fileType, kv[1]])
    );
    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  async #runMainScript(pluginName: string, scriptPath: string): Promise<void> {
    const context = {
      require: (path: string) => {
        project.logger.info(`Requiring ${path}`);
        return `Required ${path}`;
      },
      logger: project.logger,
      api: new PluginApi(),
    };
    const script = await readFile(scriptPath, 'utf8');

    // execute script in private context
    try {
      // eslint-disable-next-line no-new-func
      new Function(`with(this) { ${script} }`).call(context);
      const plugin = context.api.build();
      this.#plugins[pluginName] = plugin;
    } catch (error) {
      project.logger.log(LogLevel.error, ['plugin', pluginName], error);
    }
  }
}

export default PluginsService;
