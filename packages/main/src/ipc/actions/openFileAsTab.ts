import { IpcEvent, ChannelsRenderer, sanitizePath } from '@xtory/shared';
import fs from 'fs/promises';

export default async function openFileAsTab(
  { sender }: IpcEvent,
  path: string
) {
  try {
    const sanitizedPath = sanitizePath(path);
    const content = await fs.readFile(sanitizedPath, 'utf-8');
    sender.send(ChannelsRenderer.onOpenFileAsTab, sanitizedPath, content);
  } catch (err) {
    sender.send(
      ChannelsRenderer.toastMessage,
      `Failed to open file ${path}, Reason: ${err} `,
      'error'
    );
  }
}
