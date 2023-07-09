import { IpcResult } from './ipcResult';

export interface BrowseFileSystemResult extends IpcResult {
  canceled: boolean;
  filePaths: string[];
}
