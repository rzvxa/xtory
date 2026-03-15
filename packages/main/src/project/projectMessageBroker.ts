import type { ChannelsRenderer } from '@xtory/plugin-api';

export type ProjectMessageBroker = (
  channel: ChannelsRenderer,
  ...args: any[]
) => void;
