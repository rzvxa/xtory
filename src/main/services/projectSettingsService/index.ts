import { readFile } from 'fs/promises';
import { ProjectMessageBroker } from 'main/project/projectMessageBroker';

import ProjectWatchService from './projectWatchService';

class ProjectSettingsService {
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

  async init(): Promise<void> {
    const content = await readFile(this.#settingsPath, 'utf8');

    this.#settings = JSON.parse(content);
  }

  get<T>(key: string): T {
    return this.#settings[key] as T;
  }
}

export default ProjectSettingsService;
