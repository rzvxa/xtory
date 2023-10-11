import { IpcEvent } from '@xtory/shared';
import { store } from 'renderer/state/store/index';
import { setProjectPath } from 'renderer/state/store/project';

export default function onProjectOpened(_event: IpcEvent, projectPath: string) {
  store.dispatch(setProjectPath(projectPath));
}
