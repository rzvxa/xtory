import { lua } from 'fengari';

import { LogLevel } from 'shared/types';
import project from 'main/project';

import LuaState from './luaState';

export default function luaPrint(L: LuaState) {
  const n: number = lua.lua_gettop(L); /* number of arguments */
  const args: unknown[] = [];
  for (let i = 1; i <= n; i++) {
    const arg = lua.lua_tojsstring(L, i);
    args.push(arg);
  }
  project.logger.log(LogLevel.info, ['Lua'], ...args);
  return 0;
}
