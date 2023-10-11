import { IpcEvent, ChannelsRenderer } from '@xtory/shared';
import fs from 'fs/promises';

export default async function openFileAsTab(
  { sender }: IpcEvent,
  path: string
) {
  try {
    const content = await fs.readFile(path, 'utf-8');
    sender.send(ChannelsRenderer.onOpenFileAsTab, path, content);
  } catch (err) {
    sender.send(
      ChannelsRenderer.toastMessage,
      `Failed to open file ${path}, Reason: ${err} `,
      'error'
    );
  }
}
