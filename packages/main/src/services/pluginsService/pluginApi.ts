/* eslint-disable max-classes-per-file */
import type {
  PluginConfig,
  FlowViewConfig,
  FileViewConfig,
} from '@xtory/shared';
import type {
  IFileViewBuilder,
  IFlowViewBuilder,
  IPluginApi,
  NodeInfo,
  ServiceProvider,
} from '@xtory/plugin-api';

import project from 'main/project';

export const PLUGIN_API_VERSION = 1;

export abstract class FileViewBuilder<T extends FileViewConfig = FlowViewConfig>
  implements IFileViewBuilder
{
  protected fileTypes: string[] = [];

  protected optional: boolean = false;

  setFileType(...extensions: string[]) {
    this.fileTypes = extensions;
    return this;
  }

  /**
   * Mark this FlowView as optional - it will only be registered if the fileType already exists
   * Use this for plugins that extend file types provided by other plugins
   */
  setOptional(optional: boolean = true) {
    this.optional = optional;
    return this;
  }

  abstract build(): T;
}

export class FlowViewBuilder
  extends FileViewBuilder<FlowViewConfig>
  implements IFlowViewBuilder
{
  protected nodes: NodeInfo[] | null = null;

  protected menuItems: { title: string; data: string }[] = [];

  createMenuItem(menuTitle: string, fileLocation: string) {
    this.menuItems.push({ title: menuTitle, data: fileLocation });
    return this;
  }

  setNodes(nodes: NodeInfo[]) {
    this.nodes = nodes;
    return this;
  }

  // TODO: making these build functions private can help with a well constructed API
  build(): FlowViewConfig {
    const { fileTypes } = this;
    const { nodes } = this;
    const { menuItems } = this;
    const { optional } = this;
    // For backward compatibility, use first fileType as primary
    const fileType = fileTypes.length > 0 ? fileTypes[0] : '';
    return {
      fileType,
      viewType: 'flow',
      nodes: nodes || [],
      menuItems,
      optional,
    };
  }
}

export default class PluginBuilder implements IPluginApi {
  #fileViews: FileViewBuilder[] = [];
  #services: Record<string, ServiceProvider> = {};

  // eslint-disable-next-line class-methods-use-this
  get projectPath(): string {
    return project.path;
  }

  addFileView(type: 'flow'): FlowViewBuilder {
    switch (type) {
      case 'flow': {
        const flowView = new FlowViewBuilder();
        this.#fileViews.push(flowView);
        return flowView;
      }

      default:
        throw new Error(`Unsupported file view type: ${type}`);
    }
  }

  addService(name: string, service: ServiceProvider): this {
    this.#services[name] = service;
    return this;
  }

  build(): { plugin: PluginConfig; services: Record<string, ServiceProvider> } {
    const fileViews = this.#fileViews.map((builder) => builder.build());
    return { plugin: { fileViews }, services: this.#services };
  }
}
