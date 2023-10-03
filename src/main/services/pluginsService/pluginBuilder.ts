type ConnectionInfo = {
  in: number;
  out: number;
};

type NodeInfo = {
  type: string;
  connection: ConnectionInfo;
};

export default class PluginBuilder {
  #flowView: boolean = false;

  #nodes: NodeInfo | undefined = undefined;

  setFlowView(value: boolean) {
    this.#flowView = value;
    return this;
  }

  setNodes(nodes: NodeInfo) {
    this.#nodes = nodes;
    return this;
  }

  build() {
    const flowView = this.#flowView;
    const nodes = this.#nodes;
    return { flowView, nodes };
  }
}
