export interface ProjectTreeNode {
  name: string;
  path: string;
  isDir: boolean;
  ext?: string | undefined;
  children?: { [name: string]: ProjectTreeNode } | undefined;
}

export type ProjectTree = ProjectTreeNode;
