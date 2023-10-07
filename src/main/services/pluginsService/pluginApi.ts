/* eslint-disable max-classes-per-file */
import { PluginConfig, FlowViewConfig, NodeInfo } from 'shared/types/plugin';

// example node view creation?
// builder.flowView.createNode('node-name', () => {
//    react.
// })
// builder.flowView.setFileType('xxx') // *.xxx
// builder.flowView.setNodes(xxx)
// builder.globalShortcut.setShortcutAction(yyy)

export class FlowViewBuilder {
  #fileType: string | null = null;

  #nodes: NodeInfo[] | null = null;

  setFileType(extension: string) {
    this.#fileType = extension;
    return this;
  }

  setNodes(nodes: NodeInfo[]) {
    this.#nodes = nodes;
    return this;
  }

  // TODO: making these build functions private can help with a well constructed API
  build(): FlowViewConfig {
    const fileType = this.#fileType;
    const nodes = this.#nodes;
    return { fileType: fileType || '', nodes: nodes || [] };
  }
}

export default class PluginBuilder {
  flowView: FlowViewBuilder;

  constructor() {
    this.flowView = new FlowViewBuilder();
  }

  build(): PluginConfig {
    const flowViewBuilder = this.flowView;
    const flowView = flowViewBuilder.build();
    return { flowView };
  }
}
