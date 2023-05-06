import IpcInvokeEvent from './ipcInvokeEvent';

type IpcInvoke = (event: IpcInvokeEvent, arg: any) => any | Promise<any>;

export default IpcInvoke;
