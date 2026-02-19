import { WebContents } from 'electron';

import type LoggingService from 'main/services/loggingService';
import type PluginsService from 'main/services/pluginsService';
import type ResourceService from 'main/services/resourceService';
import type CharacterService from 'main/services/characterService';

import {
  ChannelsRenderer,
  OpenProjectResult,
  IpcResultStatus,
} from '@xtory/shared';

import type ProjectSettingsService from 'main/services/projectSettingsService';
import type Project from './project';
import type { ProjectLoaderType } from './projectLoader';

export default class ProjectManager {
  static #isInit: boolean = false;

  static #projectLoader: ProjectLoaderType;

  static #project: Project | null = null;

  static get isInit(): boolean {
    return this.#isInit;
  }

  static get isOpen(): boolean {
    this.#throwIfNotInit();
    return this.#project !== null;
  }

  static get logger(): LoggingService {
    this.#throwIfNotInit();
    if (!this.#project) {
      throw Error('No Project Is Open!');
    }
    return this.#project.loggingService;
  }

  static get pluginsService(): PluginsService {
    this.#throwIfNotInit();
    if (!this.#project) {
      throw Error('No Project Is Open!');
    }
    return this.#project.pluginsService;
  }

  static get settingsService(): ProjectSettingsService {
    this.#throwIfNotInit();
    if (!this.#project) {
      throw Error('No Project Is Open!');
    }
    return this.#project.projectSettingsService;
  }

  static get resourceService(): ResourceService {
    this.#throwIfNotInit();
    if (!this.#project) {
      throw Error('No Project Is Open!');
    }
    return this.#project.resourceService;
  }

  static get characterService(): CharacterService {
    this.#throwIfNotInit();
    if (!this.#project) {
      throw Error('No Project Is Open!');
    }
    return this.#project.characterService;
  }

  static get path(): string {
    this.#throwIfNotInit();
    if (!this.#project) {
      throw Error('No Project Is Open!');
    }
    return this.#project.projectPath;
  }

  static init(projectLoader: ProjectLoaderType) {
    if (this.#isInit) {
      throw new Error(
        'ProjectManager should only get initialized once in the lifetime of the application'
      );
    }
    this.#projectLoader = projectLoader;
  }

  static async open(
    sender: WebContents,
    projectPath: string
  ): Promise<OpenProjectResult> {
    this.#throwIfNotInit();
    if (this.isOpen) {
      this.close();
    }

    const messageBroker = (channel: string, ...args: unknown[]) =>
      sender.send(channel, ...args);

    const { status, errorMessage, project } = await this.#projectLoader(
      messageBroker,
      projectPath
    );

    if (project) {
      this.#project = project;
      // initializing services, this part can be done with type checking
      await this.#project.projectWatchService.init();
      await this.#project.loggingService.init();
      await this.#project.resourceService.init();
      await this.#project.characterService.init();
      await this.#project.projectSettingsService.init();

      // Notify renderer that plugins are starting to load BEFORE sending project opened
      // This prevents race condition where files could be opened before plugins finish loading
      const pluginCount = Object.keys(
        this.#project.projectSettingsService.get('plugins') ?? {}
      ).length;
      sender.send(ChannelsRenderer.onPluginsLoadingStart, pluginCount);

      // Send project opened event
      sender.send(ChannelsRenderer.onProjectOpened, projectPath);
      this.logger.trace('Project UI ready, loading plugins in background...');

      // Load plugins in background (non-blocking)
      // Pass skipStartMessage=true since we already sent onPluginsLoadingStart above
      this.#project.pluginsService.init(true).catch((error) => {
        this.logger.error(`Failed to initialize plugins: ${error}`);
      });
    }

    if (status === IpcResultStatus.ok) {
      this.logger.trace('Project loaded successfully');
    }

    return { status, errorMessage };
  }

  static close() {
    this.#throwIfNotInit();
    this.#project = null;
  }

  static #throwIfNotInit() {
    if (this.#isInit) {
      throw new Error('ProjectManager is called before it initialization');
    }
  }
}
