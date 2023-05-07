import { IpcEvent } from 'shared/types';
import { store } from 'renderer/state/store/index';
import { setProjectPath } from 'renderer/state/store/project';

export default function onProjectOpened(event: IpcEvent, projectPath: string) {
  store.dispatch(setProjectPath(projectPath));
}
