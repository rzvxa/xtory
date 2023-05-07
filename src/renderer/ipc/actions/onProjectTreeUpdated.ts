import { IpcEvent, ProjectTree } from 'shared/types';
import { store } from 'renderer/state/store/index';
import { setProjectPath } from 'renderer/state/store/project';

export default function onProjectTreeUpdated(
  event: IpcEvent,
  projectTree: ProjectTree
) {
  console.log(projectTree);
  // store.dispatch(setProjectPath(projectPath));
}
