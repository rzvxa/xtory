import type { IpcMainInvokeEvent } from 'electron';

import project from 'main/project';
import type { ResourceMap } from '@xtory/shared';

export default async function getResources(
  _event: IpcMainInvokeEvent
): Promise<ResourceMap> {
  return project.resourceService.getAllResources();
}
