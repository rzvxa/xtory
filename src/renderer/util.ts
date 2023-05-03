// eslint-disable-next-line import/prefer-default-export
export function sanitizePath(path: string, unixSep: boolean = true) {
  let output: string = path;
  if (unixSep) output = output.replaceAll('\\', '/');
  return output;
}
