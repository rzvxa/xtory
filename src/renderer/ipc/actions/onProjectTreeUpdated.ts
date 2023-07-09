import { IpcEvent, ProjectTree } from 'shared/types';
import { store } from 'renderer/state/store/index';
import { setProjectTree } from 'renderer/state/store/project';

export default function onProjectTreeUpdated(
  event: IpcEvent,
  projectTree: ProjectTree
) {
  store.dispatch(setProjectTree(projectTree));
}
