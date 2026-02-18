import { IpcMainInvokeEvent, dialog } from 'electron';
import project from 'main/project';

export default async function selectImageFile(
  _event: IpcMainInvokeEvent
): Promise<string | null> {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      {
        name: 'Images',
        extensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'],
      },
    ],
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }

  const selectedPath = result.filePaths[0];

  try {
    const uuid = await project.resourceService.importResource(
      selectedPath,
      'image'
    );
    return uuid ? `resource://${uuid}` : null;
  } catch (error) {
    project.logger.error(`Failed to import image as resource: ${error}`, [
      'IPC:selectImageFile',
    ]);
    return null;
  }
}
