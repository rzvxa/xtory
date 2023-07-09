import { IpcInvokeEvent, ChannelsRenderer } from 'shared/types';
import { constants } from 'fs/promises';
import { fsUtils } from 'main/utils';

export default function existsAsync(
  { sender }: IpcInvokeEvent,
  path: string,
  // eslint-disable-next-line no-bitwise
  mode: number = constants.R_OK | constants.W_OK
): Promise<boolean> {
  return fsUtils.exists(path, mode);
}
