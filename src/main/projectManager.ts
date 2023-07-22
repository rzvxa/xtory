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

import Project from './project';
import loggingService from 'main/services/loggingService';
import projectWatchService from 'main/services/projectWatchService';
import pluginsService from 'main/services/pluginsService';
import projectSettingsService from 'main/services/projectSettingsService';

export type ProjectMessageBroker = (
  channel: ChannelsRenderer,
  ...args: any[]
) => void;

class ProjectManager extends Project {
  #isProjectOpen: boolean = false;

  get isOpen(): boolean {
    return this.#isProjectOpen;
  }

  get logPath(): string {
    return `${this.projectPath}/tmp/logs.txt`;
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

    this.messageBroker = (channel: string, ...args: unknown[]) =>
      sender.send(channel, ...args);

    projectWatchService.watchProject(projectPath, messageBroker);

    // projectSettingsService.init(projectWatchService, messageBroker);

    const logger = new FileLogger(this.logPath);

    try {
      logger.init();
    } catch (error) {
      return {
        status: IpcResultStatus.error,
        errorMessage: `Failed not initialize FileLogger, Xtory can't write logs to file! Error: ${error}`,
      };
    }

    loggingService.init(logger, messageBroker);

    pluginsService.loadPlugins(`${projectPath}/plugins`, messageBroker);

    // project openned successfully setting required properties
    this.projectPath = projectPath;
    this.messageBroker = messageBroker;
    this.projectWatchService = projectWatchService;

    sender.send(ChannelsRenderer.onProjectOpened, projectPath);
    return { status: IpcResultStatus.ok };
  }

  close() {
  }
}

const projectManager = new ProjectManager();

export default projectManager;
