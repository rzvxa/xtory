import { ProjectMessageBroker } from 'main/project/projectMessageBroker';

import ProjectWatchService from './projectWatchService';

class ProjectSettingsService {
  settingsPath: string;

  projectWatchService: ProjectWatchService;

  messageBroker: ProjectMessageBroker;

  constructor(
    settingsPath: string,
    projectWatchService: ProjectWatchService,
    messageBroker: ProjectMessageBroker
  ) {
    this.settingsPath = settingsPath;
    this.projectWatchService = projectWatchService;
    this.messageBroker = messageBroker;
  }
}

export default ProjectSettingsService;
