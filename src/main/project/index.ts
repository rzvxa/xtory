import { app, WebContents } from 'electron';
import { readFile, readdir } from 'fs/promises';
import path from 'path';

import { fsUtils, FileLogger } from 'main/utils';
import { tryGetAsync } from 'shared/utils';

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

  get logPath(): string {
    return `${this.#project?.projectPath}/tmp/logs.txt`;
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
    console.log('ds', app.getVersion());
    const configFile = (await readdir(projectPath, { withFileTypes: true }))
      .filter((src) => src.isFile)
      .find((src) => path.extname(src.name) === '.xtory');
    if (!configFile) {
      return {
        status: IpcResultStatus.error,
        errorMessage: `Given path don't contain a ".xtory" file!`,
      };
    }

    const configPath = path.join(projectPath, configFile.name);

    const config = await tryGetAsync(() => readFile(configPath, 'utf8'));
    if (!config.success) {
      return {
        status: IpcResultStatus.error,
        errorMessage: `Failed to open ${configPath}`,
      };
    }

    const messageBroker = (channel: string, ...args: unknown[]) =>
      sender.send(channel, ...args);

    const projectWatchService = new ProjectWatchService(
      projectPath,
      messageBroker
    );

    const projectSettingsService = new ProjectSettingsService(
      configPath,
      projectWatchService,
      messageBroker
    );

    const logger = new FileLogger(this.logPath);

    try {
      logger.init();
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

    sender.send(ChannelsRenderer.onProjectOpened, projectPath);
    return { status: IpcResultStatus.ok };
  }

  close() {
    this.#project = null;
  }
}

const projectManager = new ProjectManager();

export default projectManager;
