import { IpcMainInvokeEvent } from 'electron';

export type IpcInvoke = (
  event: IpcMainInvokeEvent,
  args: any
) => any | Promise<any>;
