import { IpcResult } from '@xtory/plugin-api';

export interface BrowseFileSystemResult extends IpcResult {
  canceled: boolean;
  filePaths: string[];
}
