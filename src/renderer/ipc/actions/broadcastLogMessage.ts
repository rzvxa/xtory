import { IpcEvent, LogMessage } from 'shared/types';
import { store } from 'renderer/state/store/index';

import { pushLog } from 'renderer/state/store/console';

export default function broadcastLogMessage(
  event: IpcEvent,
  message: LogMessage
) {
  store.dispatch(pushLog(message));
}
