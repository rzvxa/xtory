type ConnectionInfo = {
  in: number;
  out: number;
};

type NodeInfo = {
  type: string;
  connection: ConnectionInfo;
};

// builder.flowView.setFileType('xxx') // *.xxx
// builder.flowView.setNodes(xxx)
// builder.globalShortcut.setShortcutAction(yyy)

class FlowViewBuilder {
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
  build() {
    const fileType = this.#fileType;
    const nodes = this.#nodes;
    return { fileType, nodes };
  }
}

export default class PluginBuilder {
  flowView: FlowViewBuilder;

  constructor() {
    this.flowView = new FlowViewBuilder();
  }

  build() {
    const flowViewBuilder = this.flowView;
    const flowView = flowViewBuilder.build();
    return { flowView };
  }
}
