import { ChannelsRenderer } from 'shared/types';

export type ProjectMessageBroker = (
  channel: ChannelsRenderer,
  ...args: any[]
) => void;
