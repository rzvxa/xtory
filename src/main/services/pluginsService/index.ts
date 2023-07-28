import { readFile, readdir } from 'fs/promises';
import { fsUtils } from 'main/utils';
import { ProjectMessageBroker } from 'main/project/projectMessageBroker';
import project from 'main/project';

import { LogLevel } from 'shared/types';
import { sanitizePath, tryGetAsync } from 'shared/utils';

import IService from '../IService';

class PluginsService implements IService {
  #messageBroker: ProjectMessageBroker;

  #pluginsFolder: string;

  constructor(pluginsFolder: string, messageBroker: ProjectMessageBroker) {
    this.#messageBroker = messageBroker;
    this.#pluginsFolder = sanitizePath(pluginsFolder);
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
    const configPath = `${pluginPath}/package.json`;
    if (!(await fsUtils.exists(configPath))) {
      project.logger.error(
        `${directoryName} does not contain a "package.json" file at ${configPath}`,
        ['plugin', directoryName]
      );
      return false;
    }
    const configWrapped = await tryGetAsync<string>(() =>
      readFile(configPath, 'utf8')
    );
    if (!configWrapped.success) {
      return false;
    }
    const config = JSON.parse(configWrapped.result as string);
    const name = config.name || directoryName;
    if (!config.main) {
      project.logger.warning(
        `${name} plugin, does not have a main file in its "package.json"`,
        ['plugin', name]
      );
      return false;
    }
    const mainPath = `${pluginPath}/${config.main}`;
    await this.#runMainScript(name, mainPath);
    return true;
  }

  // eslint-disable-next-line class-methods-use-this
  async #runMainScript(pluginName: string, scriptPath: string): Promise<void> {
    const context = {
      require: (path: string) => {
        project.logger.info(`Requiring ${path}`);
        return `Required ${path}`;
      },
      logger: project.logger,
    };
    const script = await readFile(scriptPath, 'utf8');

    // execute script in private context
    try {
      // eslint-disable-next-line no-new-func
      new Function(`with(this) { ${script} }`).call(context);
    } catch (error) {
      project.logger.log(LogLevel.error, ['plugin', pluginName], error);
    }
  }
}

export default PluginsService;
