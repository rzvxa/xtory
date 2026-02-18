/* eslint-disable max-classes-per-file */
import {
  PluginConfig,
  FlowViewConfig,
  NodeInfo,
} from '@xtory/shared/types/plugin';
import type {
  IFileViewBuilder,
  IFlowViewBuilder,
  IPluginApi,
} from '@xtory/plugin-api';

export const PLUGIN_API_VERSION = 1;

export class FileViewBuilder implements IFileViewBuilder {
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
}

export class FlowViewBuilder
  extends FileViewBuilder
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
    return { fileType, nodes: nodes || [], menuItems, optional };
  }
}

export default class PluginBuilder implements IPluginApi {
  #flowViews: FlowViewBuilder[] = [];

  addFileView(type: 'flow'): FlowViewBuilder {
    if (type !== 'flow') {
      throw new Error(`Unsupported file view type: ${type}`);
    }
    const flowView = new FlowViewBuilder();
    this.#flowViews.push(flowView);
    return flowView;
  }

  build(): PluginConfig {
    const flowViews = this.#flowViews.map((builder) => builder.build());
    return { flowViews };
  }
}
