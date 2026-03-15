import { IpcMainInvokeEvent, dialog } from 'electron';
import { BrowseFileSystemResult } from '@xtory/shared';
import { IpcResultStatus } from '@xtory/plugin-api';

export default async function browseFileSystemIpc(
  _event: IpcMainInvokeEvent,
  options: Object
): Promise<BrowseFileSystemResult> {
  const result = await dialog.showOpenDialog(options);
  return { status: 'OK' satisfies IpcResultStatus, ...result };
}
