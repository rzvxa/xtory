import IpcEvent from './ipcEvent';

type IpcAction = (event: IpcEvent, ...args: any[]) => void;

export default IpcAction;
