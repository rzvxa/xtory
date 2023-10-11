import type { IpcMainInvokeEvent } from 'electron';

import project from 'main/project';

export default async function removeResource(
  _event: IpcMainInvokeEvent,
  uuid: string
): Promise<boolean> {
  return project.resourceService.removeResource(uuid);
}
