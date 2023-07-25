import { readFile, readdir } from 'fs/promises';
import { fsUtils } from 'main/utils';
import { ProjectMessageBroker } from 'main/project/projectMessageBroker';

import { PluginConfig } from 'shared/types';
import { sanitizePath, tryGetAsync } from 'shared/utils';

class PluginsService {
  #messageBroker: ProjectMessageBroker;

  #pluginsFolder: string;

  constructor(pluginsFolder: string, messageBroker: ProjectMessageBroker) {
    this.#messageBroker = messageBroker;
    this.#pluginsFolder = sanitizePath(pluginsFolder);

  }

  async loadPlugins(): Promise<void> {
    const plugins = (
      await readdir(this.#pluginsFolder, { withFileTypes: true })
    ).filter((dirent) => dirent.isDirectory());

    for (let i = 0; i < plugins.length; ++i) {
      const pluginPath = `${this.#pluginsFolder}/${plugins[i].name}`;
      this.loadPlugin(pluginPath);
    }
  }

  async loadPlugin(pluginPath: string): Promise<boolean> {
    const configPath = `${pluginPath}/package.json`;
    if (!(await fsUtils.exists(configPath))) return false;
    const configWrapped = await tryGetAsync<string>(() =>
      readFile(configPath, 'utf8')
    );
    if (!configWrapped.success) {
      return false;
    }
    const config = JSON.parse(configWrapped.result as string);
    if (!config.main) {
      return false;
    }
    const mainPath = `${pluginPath}/${config.main}`;
    this.#runMainScript(mainPath);
    return true;
  }

  #runMainScript(scriptPath: string) {
  }
}

export default PluginsService;
