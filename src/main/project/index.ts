import { app, WebContents } from 'electron';

import { fsUtils, FileLogger } from 'main/utils';

import { ensureFile } from 'fs-extra';

import {
  ChannelsRenderer,
  OpenProjectResult,
  IpcResultStatus,
} from 'shared/types';

import LoggingService from 'main/services/loggingService';
import ProjectWatchService from 'main/services/projectWatchService';
import PluginsService from 'main/services/pluginsService';
import ProjectSettingsService from 'main/services/projectSettingsService';

import Project from './project';

class ProjectManager {
  #project: Project | null = null;

  get isOpen(): boolean {
    return this.#project !== null;
  }

  get logger(): LoggingService {
    if (!this.#project) {
      throw Error('No Project Is Open!');
    }
    return this.#project.loggingService;
  }

  async open(
    sender: WebContents,
    projectPath: string
  ): Promise<OpenProjectResult> {
    if (this.isOpen) {
      this.close();
    }

    if (!(await fsUtils.exists(projectPath))) {
      return {
        status: IpcResultStatus.error,
        errorMessage: `Failed to open "${projectPath}"`,
      };
    }

    // console.log('ds', app.getVersion());
    const settingsPath = `${projectPath}/xtory.json`;
    const settingsExists = await fsUtils.exists(settingsPath);

    if (!settingsExists) {
      return {
        status: IpcResultStatus.error,
        errorMessage: `Given path don't contain a "xtory.json" file!`,
      };
    }

    const messageBroker = (channel: string, ...args: unknown[]) =>
      sender.send(channel, ...args);

    const projectWatchService = new ProjectWatchService(
      projectPath,
      messageBroker
    );

    const projectSettingsService = new ProjectSettingsService(
      settingsPath,
      projectWatchService,
      messageBroker
    );

    try {
      projectSettingsService.init();
    } catch (error) {
      return {
        status: IpcResultStatus.error,
        errorMessage: `Failed to load ${settingsPath}, Error: ${error}`,
      };
    }

    const logPath = `${projectPath}/tmp/logs.txt`;
    const logger = new FileLogger(logPath);

    try {
      await ensureFile(logPath);
      await logger.init();
    } catch (error) {
      return {
        status: IpcResultStatus.error,
        errorMessage: `Failed not initialize FileLogger, Xtory can't write logs to file! Error: ${error}`,
      };
    }

    const loggingService = new LoggingService(logger, messageBroker);

    const pluginsService = new PluginsService(
      `${projectPath}/plugins`,
      messageBroker
    );

    await pluginsService.loadPlugins();

    // project openned successfully
    this.#project = {
      projectPath,
      messageBroker,
      projectWatchService,
      loggingService,
      pluginsService,
      projectSettingsService,
    };

    loggingService.trace('Project loaded successfully');

    sender.send(ChannelsRenderer.onProjectOpened, projectPath);
    return { status: IpcResultStatus.ok };
  }

  close() {
    this.#project = null;
  }
}

const projectManager = new ProjectManager();

export default projectManager;
