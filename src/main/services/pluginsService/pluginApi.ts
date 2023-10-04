export type ConnectionInfo = {
  in: number;
  out: number;
};

export type NodeInfo = {
  type: string;
  connection: ConnectionInfo;
};

export type FlowViewConfig = {
  fileType: string;
  nodes: NodeInfo[];
};

export type PluginConfig = {
  flowView: FlowViewConfig;
};

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
