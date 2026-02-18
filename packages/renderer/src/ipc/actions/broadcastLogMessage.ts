import { IpcEvent, LogMessage } from '@xtory/shared';
import { store } from 'renderer/state/store/index';

import { pushLog } from 'renderer/state/store/console';

export default function broadcastLogMessage(
  _event: IpcEvent,
  message: LogMessage
) {
  // Ensure the message is serializable before dispatching to Redux
  // In case non-serializable objects (like Error) slipped into tags
  const sanitizedMessage = {
    ...message,
    tags: Array.isArray(message.tags)
      ? message.tags.map((tag) => (typeof tag === 'string' ? tag : String(tag)))
      : [],
    message:
      typeof message.message === 'string'
        ? message.message
        : String(message.message),
  };

  store.dispatch(pushLog(sanitizedMessage));
}
