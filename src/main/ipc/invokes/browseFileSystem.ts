import { IpcMainInvokeEvent, dialog } from 'electron';

export default async function browseFileSystemIpc(
  event: IpcMainInvokeEvent,
  options: Object
): Promise<any> {
  const result = await dialog.showOpenDialog(options);
  return result;
}
