import { IpcResult } from './ipcResult';

export interface CreateNewProjectResult extends IpcResult {
  errorMessage?: string | undefined;
}
