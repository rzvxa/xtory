import { IpcMainEvent, IpcRendererEvent } from 'electron';

type IpcEvent = IpcMainEvent | IpcRendererEvent;

export default IpcEvent;
