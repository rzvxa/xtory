import type {
  IpcMainEvent,
  IpcRendererEvent,
  IpcMainInvokeEvent,
} from 'electron';

/**
 * Logger interface for plugin logging
 */
export interface Logger {
  debug(message: unknown | unknown[], tags: string[]): void;
  info(message: unknown | unknown[], tags: string[]): void;
  warning(message: unknown | unknown[], tags: string[]): void;
  error(message: unknown | unknown[], tags: string[]): void;
  fatal(message: unknown | unknown[], tags: string[]): void;
  trace(message: unknown | unknown[], tags: string[]): void;
}

export type IpcEvent = IpcMainEvent | IpcRendererEvent;
export type IpcAction = (event: IpcEvent, ...args: any[]) => void;
export type IpcInvokeEvent = IpcMainInvokeEvent;
export type IpcInvoke = (
  event: IpcInvokeEvent,
  ...args: any[]
) => any | Promise<any>;

export type IpcResultStatus = 'OK' | 'ERROR';

export interface IpcResult {
  status: IpcResultStatus;
  errorMessage?: string | undefined;
}

export type ChannelsMain =
  | 'browseFileSystem'
  | 'createNewProject'
  | 'getXtoryTemplates'
  | 'getFileTypes'
  | 'openProject'
  | 'openFileAsTab'
  | 'fspExists'
  | 'fspMkdir'
  | 'fspWriteFile'
  | 'fsMove'
  | 'fsRemove'
  | 'revealPathInOS'
  | 'customIPC'
  | 'logMessage'
  | 'selectImageFile'
  | 'importResource'
  | 'getResources'
  | 'updateResourceMetadata'
  | 'removeResource'
  | 'getPluginConfig'
  | 'updatePluginConfig'
  | 'updatePluginEnabled'
  | 'restartApp'
  | 'getCharacters'
  | 'createCharacter'
  | 'updateCharacter'
  | 'removeCharacter'
  | 'getCharacterSettings'
  | 'updateCharacterSettings'
  | 'serviceCall';

export type ChannelsRenderer =
  | 'addFileMenuItem'
  | 'broadcastLogMessage'
  | 'toastMessage'
  | 'onProjectOpened'
  | 'onOpenFileAsTab'
  | 'onProjectTreeUpdated'
  | 'onLoadPlugins'
  | 'onPluginsLoadingStart'
  | 'onPluginsLoadingComplete';

/**
 * The variable type of a variable.
 *
 * NOTE: zero is used as uninitialized canary in the C runtime, and can NOT be a valid value.
 */
export declare enum VariableType {
  Bool = 1,
  Int = 2,
  Float = 3,
  String = 4,
}

declare const unknownVariableTypeSymbol: unique symbol;
type UnknownVariableType = typeof unknownVariableTypeSymbol;
interface VariableInfoTypeMap {
  [unknownVariableTypeSymbol]: unknown;
  [VariableType.Bool]: boolean;
  [VariableType.Int]: number;
  [VariableType.Float]: number;
  [VariableType.String]: string;
}

/**
 * A variable record from the variables table, containing the variable's details
 */
export interface VariableInfo<
  T extends VariableType | UnknownVariableType = UnknownVariableType
> {
  name: string;
  type: T extends UnknownVariableType ? VariableType : T;
  init: VariableInfoTypeMap[T];
  comment?: string;
}
