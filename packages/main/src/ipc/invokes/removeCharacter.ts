import { IpcMainInvokeEvent } from 'electron';
import project from 'main/project';

export default async function removeCharacter(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _event: IpcMainInvokeEvent,
  id: string
): Promise<boolean> {
  if (!project.isOpen) {
    return false;
  }

  return await project.characterService.removeCharacter(id);
}
