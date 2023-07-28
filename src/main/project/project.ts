import type ProjectWatchService from 'main/services/projectWatchService';
import type LoggingService from 'main/services/loggingService';
import type PluginsService from 'main/services/pluginsService';
import type ProjectSettingsService from 'main/services/projectSettingsService';

import type { ProjectMessageBroker } from './projectMessageBroker';

export default interface Project {
  projectPath: string;

  messageBroker: ProjectMessageBroker;

  projectWatchService: ProjectWatchService;

  loggingService: LoggingService;

  pluginsService: PluginsService;

  projectSettingsService: ProjectSettingsService;
}
