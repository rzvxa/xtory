import { WebContents } from 'electron';

import { IService } from '@xtory/plugin-api';

import type LoggingService from 'main/services/loggingService';
import type PluginsService from 'main/services/pluginsService';
import type ResourceService from 'main/services/resourceService';
import type CharacterService from 'main/services/characterService';
import type VariablesService from 'main/services/variableService';

import {
  ChannelsRenderer,
  OpenProjectResult,
  IpcResultStatus,
} from '@xtory/shared';

import type ProjectSettingsService from 'main/services/projectSettingsService';
import type Project from './project';
import type { ProjectLoaderType } from './projectLoader';
import type { BuiltinServices } from '../services/types';

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
    return this.getService('logger');
  }

  static get pluginsService(): PluginsService {
    return this.getService('plugins');
  }

  static get settingsService(): ProjectSettingsService {
    return this.getService('settings');
  }

  static get resourceService(): ResourceService {
    return this.getService('resources');
  }

  static get characterService(): CharacterService {
    return this.getService('characters');
  }

  static get variablesService(): VariablesService {
    return this.getService('variables');
  }

  static getService<S extends keyof BuiltinServices>(
    name: S
  ): BuiltinServices[S];
  static getService<S extends string>(name: S): IService | null;
  static getService(
    name: string
  ): BuiltinServices[keyof BuiltinServices] | IService | null {
    this.#throwIfNotInit();
    if (!this.#project) {
      throw Error('No Project Is Open!');
    }
    return (
      this.#project.builtinServices[name as keyof BuiltinServices] ??
      this.#project.builtinServices.plugins.getForeignService(name)
    );
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
      process.chdir(projectPath);
      this.#project = project;
      // initializing builtin services(excluding the plugin service)
      Object.entries(this.#project.builtinServices)
        .filter(([name]) => name !== 'plugins')
        .forEach(([, svc]) => svc.init());

      // Notify renderer that plugins are starting to load BEFORE sending project opened
      // This prevents race condition where files could be opened before plugins finish loading
      const pluginCount = Object.keys(
        this.#project.builtinServices.settings.get('plugins') ?? {}
      ).length;
      sender.send(ChannelsRenderer.onPluginsLoadingStart, pluginCount);

      // Send project opened event
      sender.send(ChannelsRenderer.onProjectOpened, projectPath);
      this.logger.trace('Project UI ready, loading plugins in background...');

      // Load plugins in background (non-blocking)
      // Pass skipStartMessage=true since we already sent onPluginsLoadingStart above
      this.#project.builtinServices.plugins.init(true).catch((error) => {
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
