import { IpcEvent, extractFileExtension } from '@xtory/shared';
import { store } from 'renderer/state/store/index';

import { TabType } from 'renderer/state/types/tabs';
import { addTab, setActiveTabId } from 'renderer/state/store/tabs';
import { EzSnackbarRef } from 'renderer/utils/ezSnackbar';

export default function onOpenFileAsTab(
  _event: IpcEvent,
  path: string,
  content: string
) {
  // Check if plugins are still loading
  const { pluginsState } = store.getState();
  if ((pluginsState as any).isLoading) {
    EzSnackbarRef.info('Please wait, plugins are still loading...');
    return;
  }

  const title = path.split('/').pop(); // get the file name
  const { name, extension } = extractFileExtension(path);
  store.dispatch(
    addTab({
      id: path,
      title,
      tabType: TabType.file,
      tabData: {
        path,
        name,
        extension,
        content,
        history: {
          now: null,
          past: [],
          future: [],
        },
      },
    })
  );
  store.dispatch(setActiveTabId(path));
}
