import { IpcInvokeEvent } from '@xtory/shared';
import { constants } from 'fs/promises';
import { fsUtils } from 'main/utils';

export default function existsAsync(
  _event: IpcInvokeEvent,
  path: string,
  // eslint-disable-next-line no-bitwise
  mode: number = constants.R_OK | constants.W_OK
): Promise<boolean> {
  return fsUtils.exists(path, mode);
}
