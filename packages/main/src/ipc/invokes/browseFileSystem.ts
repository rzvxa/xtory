import { IpcMainInvokeEvent, dialog } from 'electron';
import { BrowseFileSystemResult, IpcResultStatus } from '@xtory/shared';

export default async function browseFileSystemIpc(
  _event: IpcMainInvokeEvent,
  options: Object
): Promise<BrowseFileSystemResult> {
  const result = await dialog.showOpenDialog(options);
  return { status: IpcResultStatus.ok, ...result };
}
