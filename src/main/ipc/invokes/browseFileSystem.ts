import { IpcMainInvokeEvent, dialog } from 'electron';
import { FileSystemBrowseResult, IpcResultStatus } from 'shared/types';

export default async function browseFileSystemIpc(
  event: IpcMainInvokeEvent,
  options: Object
): Promise<FileSystemBrowseResult> {
  const result = await dialog.showOpenDialog(options);
  return { status: IpcResultStatus.ok, ...result };
}
