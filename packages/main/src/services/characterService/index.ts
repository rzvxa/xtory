import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import project from 'main/project';
import type { Character, CharacterMap, CharacterSettings } from '@xtory/shared';
import { v4 as uuidv4 } from 'uuid';

class CharacterService {
  #charactersPath: string;

  #charactersMapPath: string;

  #settingsPath: string;

  #charactersMap: CharacterMap = {};

  #settings: CharacterSettings = {
    requiredAttributes: [],
  };

  constructor(projectPath: string) {
    const xtoryDir = join(projectPath, '.xtory');
    this.#charactersMapPath = join(xtoryDir, 'characters.json');
    this.#settingsPath = join(xtoryDir, 'character-settings.json');
    this.#charactersPath = xtoryDir;
  }

  async init(): Promise<boolean> {
    try {
      project.logger.info('Initializing CharacterService', [
        'CharacterService',
      ]);

      // Ensure .xtory directory exists
      await mkdir(this.#charactersPath, { recursive: true });

      // Load existing settings or create default
      try {
        const settingsContent = await readFile(this.#settingsPath, 'utf8');
        this.#settings = JSON.parse(settingsContent);
        project.logger.info('Loaded existing character settings', [
          'CharacterService',
        ]);
      } catch {
        // File doesn't exist yet, create default settings
        const { DEFAULT_CHARACTER_ATTRIBUTES: defaultAttrs } = await import(
          '@xtory/shared'
        );
        this.#settings = { requiredAttributes: defaultAttrs };
        await this.#saveSettings();
        project.logger.info('Created default character settings', [
          'CharacterService',
        ]);
      }

      // Load existing characters map
      try {
        const content = await readFile(this.#charactersMapPath, 'utf8');
        this.#charactersMap = JSON.parse(content);
        project.logger.info(
          `Loaded ${Object.keys(this.#charactersMap).length} characters`,
          ['CharacterService']
        );
      } catch {
        // File doesn't exist yet, start with empty map
        project.logger.info('No existing characters, creating new database', [
          'CharacterService',
        ]);
        this.#charactersMap = {};
        await this.#saveCharacters();
      }

      return true;
    } catch (error) {
      project.logger.error(`Failed to initialize character service: ${error}`, [
        'CharacterService',
      ]);
      return false;
    }
  }

  async #saveCharacters(): Promise<void> {
    await writeFile(
      this.#charactersMapPath,
      JSON.stringify(this.#charactersMap, null, 2),
      'utf8'
    );
  }

  async #saveSettings(): Promise<void> {
    await writeFile(
      this.#settingsPath,
      JSON.stringify(this.#settings, null, 2),
      'utf8'
    );
  }

  getAllCharacters(): CharacterMap {
    return { ...this.#charactersMap };
  }

  getCharacter(id: string): Character | null {
    return this.#charactersMap[id] || null;
  }

  async createCharacter(
    name: string,
    avatarUuid?: string,
    attributes: Record<string, any> = {}
  ): Promise<string> {
    const id = uuidv4();
    const now = new Date().toISOString();

    const character: Character = {
      id,
      name,
      avatarUuid,
      attributes,
      createdAt: now,
      updatedAt: now,
    };

    this.#charactersMap[id] = character;
    await this.#saveCharacters();

    project.logger.info(`Created character: ${name} (${id})`, [
      'CharacterService',
    ]);

    return id;
  }

  async updateCharacter(
    id: string,
    updates: Partial<Omit<Character, 'id' | 'createdAt'>>
  ): Promise<boolean> {
    const character = this.#charactersMap[id];
    if (!character) {
      project.logger.warning(`Character not found: ${id}`, [
        'CharacterService',
      ]);
      return false;
    }

    this.#charactersMap[id] = {
      ...character,
      ...updates,
      id, // Ensure id cannot be changed
      createdAt: character.createdAt, // Preserve creation time
      updatedAt: new Date().toISOString(),
    };

    await this.#saveCharacters();

    project.logger.info(`Updated character: ${id}`, ['CharacterService']);

    return true;
  }

  async removeCharacter(id: string): Promise<boolean> {
    if (!this.#charactersMap[id]) {
      project.logger.warning(`Character not found: ${id}`, [
        'CharacterService',
      ]);
      return false;
    }

    delete this.#charactersMap[id];
    await this.#saveCharacters();

    project.logger.info(`Removed character: ${id}`, ['CharacterService']);

    return true;
  }

  getSettings(): CharacterSettings {
    return { ...this.#settings };
  }

  async updateSettings(settings: CharacterSettings): Promise<void> {
    this.#settings = settings;
    await this.#saveSettings();

    project.logger.info('Updated character settings', ['CharacterService']);
  }
}

export default CharacterService;
