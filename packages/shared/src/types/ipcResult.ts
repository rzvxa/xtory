export enum IpcResultStatus {
  ok = 'OK',
  error = 'ERROR',
}

export interface IpcResult {
  status: IpcResultStatus;
  errorMessage?: string | undefined;
}
