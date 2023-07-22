import { ChannelsRenderer } from 'shared/types';

export type SettingsServiceMessageBroker = (
  channel: ChannelsRenderer,
  ...args: any[]
) => void;

class SettingsService {
  messageBroker: SettingsServiceMessageBroker | null = null;

  async init(settingsPath: string, messageBroker: SettingsServiceMessageBroker): Promise<void> {
    this.messageBroker = messageBroker;


  }
}

const settingsService = new SettingsService();

export default settingsService;
