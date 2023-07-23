// eslint-disable-next-line
import { luaconf, lua, lauxlib, lualib, to_luastring } from 'fengari';

import { readFile, readdir } from 'fs/promises';
import xtoryBindLua from 'main/lua';
import { fsUtils } from 'main/utils';
import { ProjectMessageBroker } from 'main/project/projectMessageBroker';

import { PluginConfig } from 'shared/types';
import { sanitizePath, tryGetAsync } from 'shared/utils';

class PluginsService {
  #messageBroker: ProjectMessageBroker;

  #pluginsFolder: string;

  #lua: any = null;

  constructor(pluginsFolder: string, messageBroker: ProjectMessageBroker) {
    this.#messageBroker = messageBroker;
    this.#pluginsFolder = sanitizePath(pluginsFolder);
    this.#lua = lauxlib.luaL_newstate();

    this.#initializeLuaState();
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

  #initializeLuaState() {
    // loading lua standard libs
    lualib.luaL_openlibs(this.#lua);

    // adding plugins folder to package path
    lauxlib.luaL_dostring(
      this.#lua,
      to_luastring(
        `package.path = package.path .. ';${this.#pluginsFolder}/?.lua'`
      )
    );

    // xtory libraries
    xtoryBindLua(this.#lua);
  }

  #runMainScript(scriptPath: string) {
    console.log('lua', lauxlib.luaL_dofile(this.#lua, scriptPath));
  }
}

export default PluginsService;
