import { IpcMainInvokeEvent } from 'electron';

import { fsUtils, templatesPath } from 'main/utils';
import { tryGetAsync } from 'shared/utils';
import {
  NewProjectModel,
  CreateNewProjectResult,
  IpcResultStatus,
} from 'shared/types';

import path from 'path';
import { readFile, writeFile, readdir, mkdir, cp } from 'fs/promises';

export default async function createNewProject(
  event: IpcMainInvokeEvent,
  model: NewProjectModel
): Promise<CreateNewProjectResult> {
  const { projectName, projectRoot, projectPath, projectTemplate } = model;

  if (projectRoot === '' || projectPath === '' || projectTemplate === '') {
    return {
      status: IpcResultStatus.error,
      errorMessage: 'Something went wrong, Invalid Input!',
    };
  }

  const projectRootExists = await fsUtils.exists(projectRoot);
  const projectPathExists = await fsUtils.exists(projectPath);

  const templatePath = path.join(templatesPath, projectTemplate);
  const templateConfigPath = path.join(templatePath, 'xtory.json');
  const projectConfigPath = path.join(projectPath, 'xtory.json');

  // validation begin
  if (!projectRootExists) {
    return {
      status: IpcResultStatus.error,
      errorMessage: `Path "${projectRoot}" does not exists or Xtory don't have access to it!`,
    };
  }

  if (!projectPathExists) {
    try {
      await mkdir(projectPath);
    } catch {
      return {
        status: IpcResultStatus.error,
        errorMessage: `Failed to create ${projectPath} directory.`,
      };
    }
  }

  try {
    const projectPathFiles = await readdir(projectPath);
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
  // validation end

  const readConfigResult = await tryGetAsync(() =>
    readFile(templateConfigPath, 'utf8')
  );

  if (!readConfigResult.success) {
    return {
      status: IpcResultStatus.error,
      errorMessage: `Failed to load template from "${templatePath}"`,
    };
  }
  let projectConfig = readConfigResult.result as string;

  projectConfig = projectConfig.replaceAll('{PROJECT_NAME}', projectName);

  try {
    await cp(templatePath, projectPath, {
      recursive: true,
      filter: (src) => !src.endsWith('xtory.json'),
    });
  } catch (exception) {
    return {
      status: IpcResultStatus.error,
      errorMessage: `Failed to copy template from "${templatePath}" to "${projectPath}" "${exception}"`,
    };
  }

  try {
    await writeFile(projectConfigPath, projectConfig);
  } catch (exception) {
    return {
      status: IpcResultStatus.error,
      errorMessage: `Failed to write onto file "${projectConfigPath}"`,
    };
  }

  return { status: IpcResultStatus.ok };
}
