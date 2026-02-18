import { ensureFile } from 'fs-extra';

import { fsUtils, FileLogger } from 'main/utils';

import { IpcResultStatus } from '@xtory/shared';

import LoggingService from 'main/services/loggingService';
import ProjectWatchService from 'main/services/projectWatchService';
import PluginsService from 'main/services/pluginsService';
import ProjectSettingsService from 'main/services/projectSettingsService';
import ResourceService from 'main/services/resourceService';
import CharacterService from 'main/services/characterService';

import LoadProjectResult from './loadProjectResult';
import { ProjectMessageBroker } from '../projectMessageBroker';

export default async function defaultLoadStrategy(
  messageBroker: ProjectMessageBroker,
  projectPath: string
): Promise<LoadProjectResult> {
  if (!(await fsUtils.exists(projectPath))) {
    return {
      status: IpcResultStatus.error,
      errorMessage: `Failed to open "${projectPath}"`,
    };
  }

  const settingsPath = `${projectPath}/xtory.json`;
  const settingsExists = await fsUtils.exists(settingsPath);

  if (!settingsExists) {
    return {
      status: IpcResultStatus.error,
      errorMessage: `Given path don't contain a "xtory.json" file!`,
    };
  }

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
    `${projectPath}/.xtory/plugins`,
    messageBroker
  );

  const resourceService = new ResourceService(projectPath);

  const characterService = new CharacterService(projectPath);

  const project = {
    projectPath,
    messageBroker,
    projectWatchService,
    loggingService,
    pluginsService,
    projectSettingsService,
    resourceService,
    characterService,
  };

  return { status: IpcResultStatus.ok, project };
}
