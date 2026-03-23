import type { Logger } from './common';

export * from './common';

/**
 * Current plugin API version
 */
export const PLUGIN_API_VERSION = 1;

/**
 * Unified API for plugin services
 */
export interface IService {
  init(): Promise<boolean>;
}

/**
 * Either a service constructor, or a provider function
 */
export type ServiceProvider = (new () => IService) | (() => IService);

/**
 * Undefined means unrestricted number of connection with all possible node types
 * A number means a maximum of that many connections with all possible node types
 * A configuration object can be used to provide the restriction on the node types
 */
export type ConnectionPortInfo =
  | undefined
  | number
  | {
      /**
       * Maximum number of connections
       * Undefined means no restrictions
       */
      count?: number;
      /**
       * Valid nodes to make connection with
       * Undefined means no restrictions
       */
      types?: string[];
    };

/**
 * Connection information for a node in the flow graph
 */
export interface ConnectionInfo {
  /** Information about input connections */
  in: ConnectionPortInfo;
  /** Information about output connections */
  out: ConnectionPortInfo;
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
  /** The fullpath of the xtory project in which this plugin is loading from */
  readonly projectPath: string;

  /**
   * Add a new file view configuration
   * @param type - The type of file view (currently only 'flow' is supported)
   * @returns FlowView builder for configuration
   */
  addFileView(type: 'flow'): IFlowViewBuilder;

  /**
   * Add a new foreign services
   * @param name - The unique name which the service is to be registered under, this name can be used to retrieve the service instance.
   * @param service - Either a void constructor or a provider function for constructing new, but uninitialized instance of the service.
   * @returns The same plugin API instance for chaining.
   */
  addService(name: string, service: ServiceProvider): this;
}

export interface PluginContext {
  /**
   * The plugin API builder used to configure the plugin
   */
  readonly api: IPluginApi;

  /**
   * Logger instance for this plugin
   */
  readonly logger: Logger;
}

declare global {
  const XTORY_VERSION: string;
}
