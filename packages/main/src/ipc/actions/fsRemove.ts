import type { IpcEvent } from '@xtory/plugin-api';
import { rimraf } from 'rimraf';

export default async function remove({ sender }: IpcEvent, path: string) {
  try {
    await rimraf(path);
  } catch (exception) {
    sender.send(
      'toastMessage',
      `Failed to delete "${path}" Reason: ${exception}`,
      'error'
    );
  }
}
