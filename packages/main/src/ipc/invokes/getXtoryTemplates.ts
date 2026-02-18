import { IpcMainInvokeEvent } from 'electron';
import { templatesPath } from 'main/utils';
import { readdir } from 'fs/promises';

export default async function getXtoryTemplates(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  event: IpcMainInvokeEvent,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _: undefined
): Promise<string[]> {
  try {
    const directories = (await readdir(templatesPath, { withFileTypes: true }))
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    // move Empty template to the front of results
    const empty = 'Empty';
    if (directories.indexOf(empty) > 0) {
      directories.splice(directories.indexOf(empty), 1);
      directories.unshift(empty);
    }
    return directories;
  } catch (exception) {
    return [`${exception}`];
  }
}
