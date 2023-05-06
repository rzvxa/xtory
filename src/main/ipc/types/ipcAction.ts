import { IpcMainEvent } from 'electron';

export type IpcAction = (event: IpcMainEvent, args: any) => void;
