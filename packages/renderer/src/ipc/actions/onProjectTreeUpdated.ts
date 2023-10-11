import { IpcEvent, ProjectTree } from '@xtory/shared';
import { store } from 'renderer/state/store/index';
import { setProjectTree } from 'renderer/state/store/project';

export default function onProjectTreeUpdated(
  _event: IpcEvent,
  projectTree: ProjectTree
) {
  store.dispatch(setProjectTree(projectTree));
}
