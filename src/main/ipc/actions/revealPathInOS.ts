import { spawn } from 'child_process';
import { IpcEvent, ChannelsRenderer, Platform } from 'shared/types';
import { sanitizePath } from 'shared/utils';
import { dirname } from 'path';
import { fsUtils } from 'main/utils';

const getRevealPath = async (path: string) => {
  const sanitizedPath = sanitizePath(path);
  let revealPath: string;
  if (path) {
    const parent = dirname(sanitizedPath);
    if (await fsUtils.exists(parent)) {
      revealPath = parent;
    } else {
      throw Error(`Failed to access ${path}!`);
    }
  } else {
    revealPath = '/'; // reveal root
  }
  return revealPath;
};

const revealPathInWindows = async (
  path: string,
  onError: (err: unknown) => void
) => {
  let revealPath: string;
  try {
    revealPath = await getRevealPath(path);
  } catch (err) {
    onError(err);
    return;
  }

  const proc = spawn('explorer', [revealPath]);
  proc.on('error', (err) => {
    proc.kill();
    onError(err);
  });
};

const revealPathInMac = async (
  path: string,
  onError: (err: unknown) => void
) => {
  let revealPath: string;
  try {
    revealPath = await getRevealPath(path);
  } catch (err) {
    onError(err);
    return;
  }

  const proc = spawn('open', [revealPath]);
  proc.on('error', (err) => {
    proc.kill();
    onError(err);
  });
};

const revealPathInLinux = async (
  path: string,
  onError: (err: unknown) => void
) => {
  let revealPath: string;
  try {
    revealPath = await getRevealPath(path);
  } catch (err) {
    onError(err);
    return;
  }

  const proc = spawn('xdg-open', [revealPath]);
  proc.on('error', (err) => {
    proc.kill();
    onError(err);
  });
};

export default function revealPathInOS({ sender }: IpcEvent, path: string) {
  switch (process.platform) {
    case Platform.win32:
      revealPathInWindows(path, (err: unknown) => {
        if (!err) return;
        sender.send(
          ChannelsRenderer.toastMessage,
          `Failed to reveal "${path}" in File Explorer, Error: "${err}"`,
          'error'
        );
      });
      break;
    case Platform.darwin:
      revealPathInMac(path, (err: unknown) => {
        if (!err) return;
        sender.send(
          ChannelsRenderer.toastMessage,
          `Failed to Reveal "${path}" in Finder, Error: "${err}"`,
          'error'
        );
      });
      break;
    case Platform.linux:
      revealPathInLinux(path, (err: unknown) => {
        if (!err) return;
        sender.send(
          ChannelsRenderer.toastMessage,
          `Failed to Open Containing Folder of "${path}", Error: "${err}"`,
          'error'
        );
      });
      break;
    default:
      sender.send(
        ChannelsRenderer.toastMessage,
        `Can not reveal "${path}", OS(${process.platform}) is not supported`,
        'error'
      );
      break;
  }
}
