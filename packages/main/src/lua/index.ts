import { lua } from 'fengari';

import print from './print';
import LuaState from './luaState';

export function loadGlobalFunction(
  L: LuaState,
  funcName: string,
  func: Function
) {
  lua.lua_pushjsfunction(L, func);
  lua.lua_setglobal(L, funcName);
}

export default function xtoryBindLua(L: LuaState) {
  loadGlobalFunction(L, 'print', print);
}
