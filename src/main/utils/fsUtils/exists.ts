/* eslint import/prefer-default-export: off */
import { access, constants } from 'fs/promises';

export async function exists(
  path: string,
  // eslint-disable-next-line no-bitwise
  mode: number = constants.R_OK | constants.W_OK
): Promise<boolean> {
  try {
    await access(path, mode);
    return true;
  } catch {
    return false;
  }
}
