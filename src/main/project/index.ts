import { WebContents } from 'electron';

import LoggingService from 'main/services/loggingService';

import {
  ChannelsRenderer,
  OpenProjectResult,
  IpcResultStatus,
} from 'shared/types';

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
      await this.#project.pluginsService.init();
      await this.#project.projectSettingsService.init();
    }

    if (status === IpcResultStatus.ok) {
      sender.send(ChannelsRenderer.onProjectOpened, projectPath);
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
