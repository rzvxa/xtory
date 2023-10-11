import { readFile, writeFile } from 'fs/promises';

import project from 'main/project';
import { ProjectMessageBroker } from 'main/project/projectMessageBroker';

import IService from '../IService';
import ProjectWatchService from '../projectWatchService';

export interface PluginConfiguration {
  enabled?: boolean;
}

export interface ProjectSettings {
  name: string;
  version: string;
  logLevel: number;
  plugins: Record<string, string>;
  pluginsConfiguration?: Record<string, PluginConfiguration>;
  [key: string]: unknown;
}

class ProjectSettingsService implements IService {
  #settingsPath: string;

  #projectWatchService: ProjectWatchService;

  #messageBroker: ProjectMessageBroker;

  #settings: ProjectSettings | undefined = undefined;

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

  get<K extends keyof ProjectSettings>(key: K): ProjectSettings[K] | undefined {
    return this.#settings?.[key];
  }

  async set<K extends keyof ProjectSettings>(
    key: K,
    value: ProjectSettings[K]
  ): Promise<void> {
    if (!this.#settings) {
      throw new Error('Settings not initialized');
    }
    this.#settings[key] = value;
    await writeFile(
      this.#settingsPath,
      JSON.stringify(this.#settings, null, 2),
      'utf8'
    );
  }
}

export default ProjectSettingsService;
