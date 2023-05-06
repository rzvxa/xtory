import IpcInvokeEvent from './ipcInvokeEvent';

type IpcInvoke = (
  event: IpcInvokeEvent,
  ...args: unknown[]
) => any | Promise<any>;

export default IpcInvoke;
