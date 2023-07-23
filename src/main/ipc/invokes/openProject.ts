import { IpcMainInvokeEvent } from 'electron';

import { OpenProjectResult } from 'shared/types';

import open from 'main/project/openProject';

export default function openProject(
  { sender }: IpcMainInvokeEvent,
  projectPath: string
): Promise<OpenProjectResult> {
  return open(sender, projectPath);
}
