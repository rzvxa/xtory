import { IpcInvokeEvent, ChannelsRenderer } from '@xtory/shared';
import fs from 'fs/promises';

export default async function mkdirAsync(
  { sender }: IpcInvokeEvent,
  path: string
): Promise<boolean> {
  try {
    await fs.mkdir(path);
    return true;
  } catch (err) {
    sender.send(
      ChannelsRenderer.toastMessage,
      `Failed to create folder from ${path} with Error: "${err}"`,
      'error'
    );
    return false;
  }
}
