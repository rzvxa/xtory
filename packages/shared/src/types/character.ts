export interface CharacterAttributeDefinition {
  key: string;
  label: string;
  type: 'text' | 'number' | 'boolean';
  inputType: 'input' | 'textarea' | 'checkbox';
  required: boolean;
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
  {
    key: 'sex',
    label: 'Sex',
    type: 'text',
    inputType: 'input',
    required: false,
    showInCard: true,
  },
  {
    key: 'age',
    label: 'Age',
    type: 'number',
    inputType: 'input',
    required: false,
    showInCard: true,
  },
  {
    key: 'role',
    label: 'Role',
    type: 'text',
    inputType: 'input',
    required: false,
    showInCard: true,
  },
  {
    key: 'faction',
    label: 'Faction',
    type: 'text',
    inputType: 'input',
    required: false,
    showInCard: false,
  },
  {
    key: 'description',
    label: 'Description',
    type: 'text',
    inputType: 'textarea',
    required: false,
    showInCard: false,
  },
];
