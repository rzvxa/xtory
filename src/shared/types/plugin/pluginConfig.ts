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
