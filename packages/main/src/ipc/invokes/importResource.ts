import { IpcMainInvokeEvent } from 'electron';
import project from 'main/project';

export default async function importResource(
  _event: IpcMainInvokeEvent,
  sourcePath: string,
  type: string = 'image'
): Promise<string | null> {
  try {
    if (!project.isOpen) {
      // eslint-disable-next-line no-console
      console.error(
        '[IPC:importResource] Cannot import resource: No project is open'
      );
      return null;
    }

    const uuid = await project.resourceService.importResource(sourcePath, type);

    if (!uuid) {
      project.logger.error('ResourceService returned null', [
        'IPC:importResource',
      ]);
    }

    return uuid;
  } catch (error) {
    project.logger.error(`Failed to import resource: ${error}`, [
      'IPC:importResource',
    ]);
    return null;
  }
}
