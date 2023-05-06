import IpcEvent from './ipcEvent';

type IpcAction = (event: IpcEvent, arg: any) => void;

export default IpcAction;
