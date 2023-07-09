import { IpcMainInvokeEvent, IpcRendererInvokeEvent } from 'electron';

type IpcInvokeEvent = IpcMainInvokeEvent | IpcRendererInvokeEvent;

export default IpcInvokeEvent;
