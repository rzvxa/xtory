import type ReactType from 'react';
import type * as ReactFlow from 'reactflow';

/**
 * Current plugin API version
 */
export const PLUGIN_API_VERSION = 1;

/**
 * Connection information for a node in the flow graph
 */
export interface ConnectionInfo {
  /** Number of input connections */
  in: number;
  /** Number of output connections */
  out: number;
}

/**
 * Node configuration for flow view
 */
export interface NodeInfo {
  /** The type identifier for this node */
  type: string;
  /** Connection configuration */
  connections: ConnectionInfo;
  /** Optional renderer component identifier (e.g., 'plugin-name/ComponentName') */
  renderer?: string;
}

export interface IFileViewBuilder {
  /**
   * Set the file extension this FlowView handles
   * @param extensions - File extensions without the dot (e.g., 'xflow')
   * @returns This builder for chaining
   */
  setFileType(...extensions: string[]): this;

  /**
   * Mark this FlowView as optional - it will only be registered if the fileType has a flow view.
   * Use this for plugins that extend file types provided by other plugins.
   * @param optional - Whether this FlowView is optional (defaults to true)
   * @returns This builder for chaining
   */
  setOptional(optional?: boolean): this;
}

/**
 * Builder for configuring FlowView file types
 */
export interface IFlowViewBuilder extends IFileViewBuilder {
  /**
   * Create a menu item for creating new files of this type
   * @param menuTitle - The title shown in the menu
   * @param fileLocation - Path to the template file
   * @returns This builder for chaining
   */
  createMenuItem(menuTitle: string, fileLocation: string): this;

  /**
   * Set the nodes available in this FlowView
   * @param nodes - Array of node configurations
   * @returns This builder for chaining
   */
  setNodes(nodes: NodeInfo[]): this;
}

/**
 * Main plugin API builder
 */
export interface IPluginApi {
  /**
   * Add a new file view configuration
   * @param type - The type of file view (currently only 'flow' is supported)
   * @returns FlowView builder for configuration
   */
  addFileView(type: 'flow'): IFlowViewBuilder;
}

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
 * Modules exposed from xtory to be accessed by the plugins.
 * NOTE: the renderer environment does not allow arbitrary imports
 * and everything should be bundled with in a single file.
 * Renderer files are not allowed to import anything directly and can only access these explictly
 * exposed exports
 */
export interface XtoryRendererExposedModules {
  React: typeof ReactType;
  ReactFlow: typeof ReactFlow;
}

/**
 * Hooks exposed from xtory renderer
 */
export interface XtoryRendererExposedHooks {
  /** Hook to access the global resource drawer */
  useResourceDrawer: () => UseResourceDrawer;
}

export type NodeComponent = ReactType.ComponentType<any>;

/**
 * Renderer bindings exposed to the plugin through the window instance
 */
export interface XtoryRenderer {
  modules: XtoryRendererExposedModules;
  hooks: XtoryRendererExposedHooks;
  registerNodeRenderer: (id: string, component: NodeComponent) => void;
  getNodeRenderer: (id: string) => NodeComponent | null;
}

declare global {
  /**
   * The plugin API builder used to configure the plugin
   */
  const api: IPluginApi;

  /**
   * Logger instance for this plugin
   */
  const logger: Logger;

  // renderer extensions
  interface Window {
    renderer: XtoryRenderer;
  }
}
