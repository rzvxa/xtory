declare module 'fengari' {
  export const lua: any;
  export const lauxlib: any;
  export const lualib: any;
  // eslint-disable-next-line camelcase
  export const to_jsstring: (str: any) => string;
  // eslint-disable-next-line camelcase
  export const to_luastring: (str: string) => any;
}
