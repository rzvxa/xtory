import { ProjectTree } from '@xtory/shared';

export interface ProjectState {
  projectPath: string | null;
  projectTree: ProjectTree;
}
