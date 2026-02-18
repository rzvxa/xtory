export type ConnectionInfo = {
  in: number;
  out: number;
};

export type NodeInfo = {
  type: string;
  connections: ConnectionInfo;
  renderer?: string;
};

export type FlowViewConfig = {
  fileType: string;
  nodes: NodeInfo[];
  menuItems: { title: string; data: string }[];
  optional?: boolean; // If true, only register if fileType already exists
};

export type PluginConfig = {
  flowViews: FlowViewConfig[];
  dependencies?: string[]; // Plugin dependencies
};
