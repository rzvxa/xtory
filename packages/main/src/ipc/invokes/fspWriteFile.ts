import type { IpcInvokeEvent } from '@xtory/plugin-api';
import fs from 'fs/promises';

export default async function mkdirAsync(
  { sender }: IpcInvokeEvent,
  path: string,
  data: string
): Promise<boolean> {
  try {
    await fs.writeFile(path, data);
    return true;
  } catch (err) {
    sender.send(
      'toastMessage',
      `Failed to write ${data} to ${path} with Error: "${err}"`,
      'error'
    );
    return false;
  }
}
