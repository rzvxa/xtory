type JoinSegments<T extends string, U extends string> = `${T}.${U}`;

export type LocalStorageKeys<T, P extends string | never = never> = {
  [K in keyof T & string]: T[K] extends true
    ? JoinSegments<P, K>
    : T[K] extends object
    ? LocalStorageKeys<T[K], [P] extends [never] ? K : JoinSegments<P, K>>
    : never;
};

function defineKeys<T extends object>(
  keys: T,
  parent?: string
): LocalStorageKeys<T> {
  return Object.fromEntries(
    Object.entries(keys).map(([k, v]) => {
      let value;
      if (typeof v === 'object') {
        value = defineKeys(v, k);
      } else if (v === true) {
        value = `${parent}.${k}`;
      } else {
        throw new Error('Invalid input value');
      }
      return [k, value];
    })
  ) as LocalStorageKeys<T>;
}

export default defineKeys({
  state: {
    toolbox: {
      width: true,
      isOpen: true,
    },
    statusbar: {
      height: true,
    },
  },
} as const);
