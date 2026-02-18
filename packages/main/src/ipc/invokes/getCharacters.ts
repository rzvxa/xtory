import { IpcMainInvokeEvent } from 'electron';
import project from 'main/project';
import type { CharacterMap } from '@xtory/shared';

export default async function getCharacters(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _event: IpcMainInvokeEvent,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _: undefined
): Promise<CharacterMap> {
  if (!project.isOpen) {
    return {};
  }

  return project.characterService.getAllCharacters();
}
