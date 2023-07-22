import ProjectWatchService from 'main/services/projectWatchService';
import LoggingService from 'main/services/loggingService';
import PluginsService from 'main/services/pluginsService';
import ProjectSettingsService from 'main/services/projectSettingsService';

import { ProjectMessageBroker } from './projectMessageBroker';

export default interface Project {
  projectPath: string;

  messageBroker: ProjectMessageBroker;

  projectWatchService: ProjectWatchService;

  loggingService: LoggingService;

  pluginsService: PluginsService;

  projectSettingsService: ProjectSettingsService;
}
