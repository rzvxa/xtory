export interface CharacterAttributeDefinition {
  key: string;
  label: string;
  type: 'text' | 'number' | 'boolean';
  showInCard: boolean;
}

export interface CharacterSettings {
  requiredAttributes: CharacterAttributeDefinition[];
}

export interface Character {
  id: string; // UUID v4
  name: string;
  avatarUuid?: string; // Reference to ResourceService
  attributes: Record<string, any>; // All attributes (required + custom)
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

export type CharacterMap = Record<string, Character>; // UUID → Character

export const DEFAULT_CHARACTER_ATTRIBUTES: CharacterAttributeDefinition[] = [
  { key: 'sex', label: 'Sex', type: 'text', showInCard: true },
  { key: 'age', label: 'Age', type: 'number', showInCard: true },
  { key: 'role', label: 'Role', type: 'text', showInCard: true },
  { key: 'faction', label: 'Faction', type: 'text', showInCard: false },
];
