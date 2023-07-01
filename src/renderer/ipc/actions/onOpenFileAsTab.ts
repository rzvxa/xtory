import { IpcEvent } from 'shared/types';
import { store } from 'renderer/state/store/index';

import { TabType } from 'renderer/state/types/tabs';
import { addTab, setActiveTabId } from 'renderer/state/store/tabs';

export default function onOpenFileAsTab(
  event: IpcEvent,
  path: string,
  content: string
) {
  const title = path.split('/').pop(); // get the file name
  const [name, extension] = title!.split('.');
  store.dispatch(
    addTab({
      id: path,
      title,
      tabType: TabType.file,
      tabData: {
        path,
        name,
        extension,
        extra: content,
      },
    })
  );
  store.dispatch(setActiveTabId(path));
}
