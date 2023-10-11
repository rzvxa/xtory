import { IpcEvent } from '@xtory/shared';
import { store } from 'renderer/state/store/index';
import { addFileMenuItem as addFileMenuItemAction } from 'renderer/state/store/filesTool';

export default function addFileMenuItem(
  _event: IpcEvent,
  title: string,
  templatePath: string
) {
  store.dispatch(addFileMenuItemAction({ title, templatePath }));
}
