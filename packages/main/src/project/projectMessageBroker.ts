import { ChannelsRenderer } from '@xtory/shared';

export type ProjectMessageBroker = (
  channel: ChannelsRenderer,
  ...args: any[]
) => void;
