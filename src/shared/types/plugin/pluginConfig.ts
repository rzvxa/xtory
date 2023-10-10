export type ConnectionInfo = {
  in: number;
  out: number;
};

export type NodeInfo = {
  type: string;
  connections: ConnectionInfo;
};

export type FlowViewConfig = {
  fileType: string;
  nodes: NodeInfo[];
};

export type PluginConfig = {
  flowViews: FlowViewConfig[];
};
