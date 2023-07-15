import { luaconf, lua, lauxlib, lualib, to_luastring } from 'fengari';

import { readFile, readdir } from 'fs/promises';
import { fsUtils } from 'main/utils';

import { ChannelsRenderer, PluginConfig } from 'shared/types';
import { sanitizePath, tryGetAsync } from 'shared/utils';

export type PluginsServiceMessageBroker = (
  channel: ChannelsRenderer,
  ...args: any[]
) => void;

class PluginsService {
  messageBroker: PluginsServiceMessageBroker | null = null;

  pluginsFolder: string | null = null;

  lua: any = null;

  async loadPlugins(
    pluginsFolder: string,
    messageBroker: PluginsServiceMessageBroker
  ): Promise<void> {
    this.unloadPlugins();
    this.messageBroker = messageBroker;
    this.pluginsFolder = sanitizePath(pluginsFolder);

    // initializing lua state
    this.lua = lauxlib.luaL_newstate();
    lualib.luaL_openlibs(this.lua);
    console.log(
      lauxlib.luaL_dostring(
        this.lua,
        to_luastring(`package.path = package.path .. ';${pluginsFolder}/?.lua'`)
      )
    );

    const plugins = (
      await readdir(pluginsFolder, { withFileTypes: true })
    ).filter((dirent) => dirent.isDirectory());

    for (let i = 0; i < plugins.length; ++i) {
      const pluginPath = `${pluginsFolder}/${plugins[i].name}`;
      this.loadPlugin(pluginPath);
    }
  }

  unloadPlugins(): void {
    this.messageBroker = null;
  }

  async loadPlugin(pluginPath: string): Promise<boolean> {
    const configPath = `${pluginPath}/config.json`;
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
    console.log('lua', lauxlib.luaL_dofile(this.lua, scriptPath));
  }
}

const pluginsService = new PluginsService();

export default pluginsService;
