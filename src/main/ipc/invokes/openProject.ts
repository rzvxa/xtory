import { IpcMainInvokeEvent } from 'electron';

import { OpenProjectResult } from 'shared/types';

import project from 'main/project';

export default function openProject(
  { sender }: IpcMainInvokeEvent,
  projectPath: string
): Promise<OpenProjectResult> {
  return project.open(sender, projectPath);
}
