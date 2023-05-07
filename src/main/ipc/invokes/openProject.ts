import { IpcMainInvokeEvent } from 'electron';
import { readFile, readdir } from 'fs/promises';
import path from 'path';

import { fsUtils } from 'main/utils';
import { tryGetAsync } from 'shared/utils';

import {
  ChannelsRenderer,
  OpenProjectResult,
  IpcResultStatus,
} from 'shared/types';

export default async function openProject(
  { sender }: IpcMainInvokeEvent,
  projectPath: string
): Promise<OpenProjectResult> {
  if (!(await fsUtils.exists(projectPath))) {
    return {
      status: IpcResultStatus.error,
      errorMessage: `Failed to open "${projectPath}"`,
    };
  }
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

  sender.send(ChannelsRenderer.onProjectOpened, projectPath);
  return { status: IpcResultStatus.ok };
}
