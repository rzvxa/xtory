import { readFile } from 'fs/promises';

import project from 'main/project';
import { ProjectMessageBroker } from 'main/project/projectMessageBroker';

import IService from '../IService';
import ProjectWatchService from '../projectWatchService';

class ProjectSettingsService implements IService {
  #settingsPath: string;

  #projectWatchService: ProjectWatchService;

  #messageBroker: ProjectMessageBroker;

  #settings: { [key: string]: unknown } = {};

  constructor(
    settingsPath: string,
    projectWatchService: ProjectWatchService,
    messageBroker: ProjectMessageBroker
  ) {
    this.#settingsPath = settingsPath;
    this.#projectWatchService = projectWatchService;
    this.#messageBroker = messageBroker;
  }

  async init(): Promise<boolean> {
    try {
      const content = await readFile(this.#settingsPath, 'utf8');

      this.#settings = JSON.parse(content);
      return true;
    } catch (error) {
      project.logger.error(`Failed to load project settings, ${error}`, [
        'ProjectSettingsService',
      ]);
      return false;
    }
  }

  get<T>(key: string): T {
    return this.#settings[key] as T;
  }
}

export default ProjectSettingsService;
