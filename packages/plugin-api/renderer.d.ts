import type React from 'react';
import type { TextFieldProps } from '@mui/material';
import type * as ReactFlow from 'reactflow';
import type * as Icons from '@mui/icons-material';

import type { Logger } from '.';

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

/**
 * UI components and utilities exposed to plugins for consistent theming
 */
export interface XtoryRendererExposedUI {
  icons: typeof Icons;
  // Material-UI components
  Box: any; // MUI Box component
  Typography: any; // MUI Typography component
  TextField: any; // MUI TextField component
  Button: any; // MUI Button component
  IconButton: any; // MUI IconButton component
  Paper: any; // MUI Paper component
  Autocomplete: any; // MUI Autocomplete component
  Chip: any; // MUI Chip component
  Dialog: any; // MUI Dialog component
  DialogTitle: any; // MUI DialogTitle component
  DialogContent: any; // MUI DialogContent component
  DialogActions: any; // MUI DialogActions component
  // MUI utilities
  styled: any; // MUI styled utility
  useTheme: () => any; // MUI useTheme hook
  // Shared components
  NodeContainer: React.ComponentType<{
    title: string;
    selected: boolean;
    children: React.ReactNode;
  }>;
  TextArea({ sx, ...rest }: TextFieldProps): React.ReactNode;
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
}

interface GenericNodeProps<T = any> extends ReactFlow.NodeProps {
  data: T;
}

declare global {
  namespace React {}
  interface React {}
  namespace Renderer {
    type NodeProps<T = any> = GenericNodeProps<T>;
  }
  interface Window {
    renderer: XtoryRenderer;
    electron: {
      ipcRenderer: {
        invoke(channel: string, ...args: any[]): Promise<any>;
        sendMessage(channel: string, ...args: any[]): void;
        on(channel: string, func: (...args: any[]) => void): void;
        once(channel: string, func: (...args: any[]) => void): void;
      };
    };
  }
}
