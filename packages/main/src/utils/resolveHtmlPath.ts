/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import path from 'path';

export function resolveHtmlPath(
  htmlFileName: string,
  data?: Record<string, string>
) {
  const params = data
    ? `?${Object.entries(data)
        .map(([k, v]) => `${k}=${v}`)
        .join('&')}`
    : '';
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}${params}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(
    __dirname,
    '../renderer/',
    htmlFileName
  )}${params}`;
}
