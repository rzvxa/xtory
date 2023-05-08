export interface ProjectTreeNodeState {
  nodeId: string;
  isSelected: boolean;
  isRename: boolean;
}

export interface FilesToolState {
  isProjectTreeFocus: boolean;
  projectTreeNodeStates: { [nodeId: string]: ProjectTreeNodeState };
}
