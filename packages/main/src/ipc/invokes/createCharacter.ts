import { IpcMainInvokeEvent } from 'electron';
import project from 'main/project';

export default async function createCharacter(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _event: IpcMainInvokeEvent,
  name: string,
  avatarUuid?: string,
  attributes: Record<string, any> = {}
): Promise<string | null> {
  if (!project.isOpen) {
    return null;
  }

  return await project.characterService.createCharacter(
    name,
    avatarUuid,
    attributes
  );
}
