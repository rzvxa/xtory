import { IpcMainInvokeEvent, dialog } from 'electron';
import { BrowseFileSystemResult, IpcResultStatus } from 'shared/types';

export default async function browseFileSystemIpc(
  event: IpcMainInvokeEvent,
  options: Object
): Promise<BrowseFileSystemResult> {
  const result = await dialog.showOpenDialog(options);
  return { status: IpcResultStatus.ok, ...result };
}
