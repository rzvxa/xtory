import type { IpcMainInvokeEvent } from 'electron';

import project from 'main/project';

export default async function updateResourceMetadata(
  _event: IpcMainInvokeEvent,
  uuid: string,
  updates: { description?: string; originalName?: string }
): Promise<boolean> {
  return project.resourceService.updateResourceMetadata(uuid, updates);
}
