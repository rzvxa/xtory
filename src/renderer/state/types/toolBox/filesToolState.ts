export interface ProjectTreeNodeState {
  nodeId: string;
  isSelected: boolean;
  isExpanded: boolean;
  isRename: boolean;
}

export type ProjectTreeNodeStates = { [nodeId: string]: ProjectTreeNodeState };

export interface FilesToolState {
  isProjectTreeFocus: boolean;
  projectTreeNodeStates: ProjectTreeNodeStates;
}
