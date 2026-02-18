import { IpcMainInvokeEvent } from 'electron';
import project from 'main/project';
import type { CharacterSettings } from '@xtory/shared';

export default async function getCharacterSettings(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _event: IpcMainInvokeEvent,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _: undefined
): Promise<CharacterSettings | null> {
  if (!project.isOpen) {
    return null;
  }

  return project.characterService.getSettings();
}
