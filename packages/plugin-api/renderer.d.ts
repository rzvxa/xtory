import type React from 'react';
import type * as Mui from '@mui/material';
import type * as ReactFlow from 'reactflow';
import type * as Icons from '@mui/icons-material';

import type {
  IpcAction,
  IpcResult,
  ChannelsMain,
  ChannelsRenderer,
  VariableInfo,
  Logger,
  VariableType,
} from './common';

export * from './common';

/**
 * Current plugin API version
 */
export const PLUGIN_API_VERSION = 1;

/**
 * Modules exposed from xtory to be accessed by the plugins.
 * NOTE: the renderer environment does not allow arbitrary imports
 * and everything should be bundled with in a single file.
 * Renderer files are not allowed to import anything directly and can only access these explictly
 * exposed exports
 */
export interface XtoryRendererExposedModules {
  React: typeof React;
  ReactFlow: typeof ReactFlow;
}

export interface PickVariableProps {
  selected: VariableInfo['name'] | null;
  onChange?: (
    event: React.SyntheticEvent,
    newValue: VariableInfo | null
  ) => void;
  filter?: (variables: VariableInfo[], input: string) => VariableInfo[];
  /** Custom item renderer */
  renderItem?: (
    props: React.HTMLAttributes<HTMLLIElement> & { key: any },
    variable: VariableInfo,
    state: Mui.AutocompleteRenderOptionState
  ) => React.ReactNode;
  sx?: Mui.SxProps<Mui.Theme>;
  style?: React.CSSProperties;
}
export type NodeRelativeHandle = ReactFlow.HandleProps &
  Omit<React.HTMLAttributes<HTMLDivElement>, 'id'> &
  React.RefAttributes<HTMLDivElement>;

/**
 * UI components and utilities exposed to plugins for consistent theming
 */
export interface XtoryRendererExposedUI {
  icons: typeof Icons;

  // Material-UI components
  Box: typeof Mui.Box;
  Checkbox: typeof Mui.Checkbox;
  Typography: typeof Mui.Typography;
  TextField: typeof Mui.TextField;
  Button: typeof Mui.Button;
  IconButton: typeof Mui.IconButton;
  Paper: typeof Mui.Paper;
  Autocomplete: typeof Mui.Autocomplete;
  Chip: typeof Mui.Chip;
  Dialog: typeof Mui.Dialog;
  DialogTitle: typeof Mui.DialogTitle;
  DialogContent: typeof Mui.DialogContent;
  DialogActions: typeof Mui.DialogActions;
  Select: typeof Mui.Select;
  MenuItem: typeof Mui.MenuItem;
  FormControl: typeof Mui.FormControl;
  FormLabel: typeof Mui.FormLabel;
  InputLabel: typeof Mui.InputLabel;
  Tooltip: typeof Mui.Tooltip;
  InputAdornment: typeof Mui.InputAdornment;

  // MUI utilities
  styled: typeof Mui.styled;
  useTheme: typeof Mui.useTheme;

  // Shared xtory components
  NodeContainer: React.ComponentType<{
    title: string;
    selected: boolean;
    children: React.ReactNode;
  }>;
  TextArea: React.ComponentType<Mui.TextFieldProps>;
  PickVariable: React.ComponentType<PickVariableProps>;
  NodeRelativeHandle: React.ComponentType<NodeRelativeHandle>;
}

/**
 * Options for opening the resource drawer
 */
export interface OpenResourceDrawerOptions {
  /** The type of resource to filter (default: 'image') */
  filterType?: string;
  /** Callback invoked when a resource is selected */
  onSelect: (uuid: string) => void;
}

/**
 * Hook for opening the resource drawer
 */
export interface UseResourceDrawer {
  /** Function to open the resource drawer with specified options */
  openResourceDrawer: (options: OpenResourceDrawerOptions) => void;
}

/**
 * Hooks exposed from xtory renderer
 */
export interface XtoryRendererExposedHooks {
  /** Hook to access the global resource drawer */
  useResourceDrawer: () => UseResourceDrawer;
  useInit(initCallback: (resolve: () => void) => void): void;
  /** Focus and center a node in a flow view context */
  useFocusAndCenter(
    ref: React.RefObject<HTMLElement>,
    id: string,
    selected: boolean
  ): (resolve?: (() => void) | undefined) => void;
  /** Hook to gain access to the variables */
  useVariables: () => Record<string, VariableInfo>;
}

export type NodeComponent = React.ComponentType<any>;

/**
 * Renderer bindings exposed to the plugin through the window instance
 */
export interface XtoryRenderer {
  modules: XtoryRendererExposedModules;
  ui: XtoryRendererExposedUI;
  hooks: XtoryRendererExposedHooks;
  logger: Logger;
  registerNodeRenderer: (id: string, component: NodeComponent) => void;
  getNodeRenderer: (id: string) => NodeComponent | null;
  VariableType: typeof VariableType;
  uuidv4: () => string;
}

interface GenericNodeProps<T = any> extends ReactFlow.NodeProps {
  data: T;
}

export interface ElectronHandler {
  ipcRenderer: {
    on(channel: ChannelsRenderer, ipcAction: IpcAction): () => void;
    once(channel: ChannelsRenderer, func: (...args: unknown[]) => void): void;
    sendMessage(channel: ChannelsMain, ...args: unknown[]): void;
    invoke(channel: ChannelsMain, ...args: unknown[]): Promise<IpcResult | any>;
  };
}

declare global {
  namespace React {}
  interface React {}
  namespace Renderer {
    type NodeProps<T = any> = GenericNodeProps<T>;
  }
  interface Window {
    readonly renderer: XtoryRenderer;
    readonly electron: ElectronHandler;
  }
}
