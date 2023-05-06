import IpcEvent from './ipcEvent';

type IpcAction = (event: IpcEvent, ...args: unknown[]) => void;

export default IpcAction;
