import { IpcMainInvokeEvent } from 'electron';
import project from 'main/project';
import type { CharacterSettings } from '@xtory/shared';

export default async function updateCharacterSettings(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _event: IpcMainInvokeEvent,
  settings: CharacterSettings
): Promise<boolean> {
  if (!project.isOpen) {
    return false;
  }

  await project.characterService.updateSettings(settings);
  return true;
}
