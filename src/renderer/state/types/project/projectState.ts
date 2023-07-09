import { ProjectTree } from 'shared/types';

export interface ProjectState {
  projectPath: string | null;
  projectTree: ProjectTree;
}
