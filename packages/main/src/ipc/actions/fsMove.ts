import type { IpcEvent } from '@xtory/plugin-api';
import fs from 'fs-extra';

export default function moveOnFileSystem(
  { sender }: IpcEvent,
  src: string,
  dest: string
) {
  fs.move(src, dest, (err) => {
    if (!err) return;
    sender.send(
      'toastMessage',
      `Failed to move file from ${src} to ${dest} with Error: "${err}"`,
      'error'
    );
  });
}
