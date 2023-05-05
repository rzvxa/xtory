import { IpcMainInvokeEvent } from 'electron';

import { fsUtils } from 'main/utils';
import {
  NewProjectModel,
  CreateNewProjectResult,
  IpcResultStatus,
} from 'shared/types';

import { promises as fsp } from 'fs';

export default async function createNewProject(
  event: IpcMainInvokeEvent,
  model: NewProjectModel
): Promise<CreateNewProjectResult> {
  const { projectRoot, projectPath } = model;
  const projectRootExists = await fsUtils.exists(projectRoot);
  const projectPathExists = await fsUtils.exists(projectPath);

  // validation
  if (!projectRootExists) {
    return {
      status: IpcResultStatus.error,
      errorMessage: `Path "${projectRoot}" does not exists or Xtory don't have access to it!`,
    };
  }

  if (!projectPathExists) {
    try {
      await fsp.mkdir(projectPath);
    } catch {
      return {
        status: IpcResultStatus.error,
        errorMessage: `Failed to create ${projectPath} directory.`,
      };
    }
  }

  try {
    const projectPathFiles = await fsp.readdir(projectPath);
    if (projectPathFiles.length > 0) {
      return {
        status: IpcResultStatus.error,
        errorMessage: `"${projectPath}" is not empty.`,
      };
    }
  } catch {
    return {
      status: IpcResultStatus.error,
      errorMessage: `Failed to access "${projectPath}".`,
    };
  }
  return { status: IpcResultStatus.ok };
}
