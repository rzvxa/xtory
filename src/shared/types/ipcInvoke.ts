import IpcInvokeEvent from './ipcInvokeEvent';

type IpcInvoke = (
  event: IpcInvokeEvent,
  ...args: any[]
) => any | Promise<any>;

export default IpcInvoke;
