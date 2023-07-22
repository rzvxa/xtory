import { lua } from 'fengari';
import LuaState from './luaState';

export default function luaPrint(L: LuaState) {
  const n: number = lua.lua_gettop(L); /* number of arguments */
  const args: unknown[] = [];
  for (let i = 1; i <= n; i++) {
    const arg = lua.lua_tojsstring(L, i);
    args.push(arg);
  }
  console.log('print from lua', ...args);
  return 0;
}
