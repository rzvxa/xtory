import { IpcEvent, ChannelsRenderer } from '@xtory/shared';
import { rimraf } from 'rimraf';

export default async function remove({ sender }: IpcEvent, path: string) {
  try {
    await rimraf(path);
  } catch (exception) {
    sender.send(
      ChannelsRenderer.toastMessage,
      `Failed to delete "${path}" Reason: ${exception}`,
      'error'
    );
  }
}
