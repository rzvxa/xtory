import { IpcMainInvokeEvent } from 'electron';
import project from 'main/project';
import type { Character } from '@xtory/shared';

export default async function updateCharacter(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _event: IpcMainInvokeEvent,
  id: string,
  updates: Partial<Omit<Character, 'id' | 'createdAt'>>
): Promise<boolean> {
  if (!project.isOpen) {
    return false;
  }

  return await project.characterService.updateCharacter(id, updates);
}
