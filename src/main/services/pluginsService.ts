import { luaconf, lua, lauxlib, lualib, to_luastring } from 'fengari';

import { readFile, readdir } from 'fs/promises';
import xtoryOpenLibs, { LuaState } from 'main/lua';
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
    this.lua = lauxlib.luaL_newstate();

    this.#initializeLuaState();

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

  #initializeLuaState() {
    // loading lua standard libs
    lualib.luaL_openlibs(this.lua);

    // adding plugins folder to package path
    lauxlib.luaL_dostring(
      this.lua,
      to_luastring(
        `package.path = package.path .. ';${this.pluginsFolder}/?.lua'`
      )
    );
    // setting print function
    lua.lua_pushjsfunction(this.lua, this.#luaPrint);
    lua.lua_setglobal(this.lua, 'print');
    // xtory libraries
    xtoryOpenLibs(this.lua);
  }

  #luaPrint(L: any) {
    const n: number = lua.lua_gettop(L); /* number of arguments */
    const args: unknown[] = [];
    for (let i = 1; i <= n; i++) {
      const arg = lua.lua_tojsstring(L, i);
      args.push(arg);
    }
    console.log('print from lua', ...args);
    return 0;
  }

  #runMainScript(scriptPath: string) {
    console.log('lua', lauxlib.luaL_dofile(this.lua, scriptPath));
  }
}

const pluginsService = new PluginsService();

export default pluginsService;
