import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import SettingsIcon from '@mui/icons-material/Settings';
import AddIcon from '@mui/icons-material/Add';

import type { Character, CharacterMap, CharacterSettings } from '@xtory/shared';
import { EzSnackbarRef } from 'renderer/utils/ezSnackbar';
import { levenshtein } from 'renderer/utils/levenshtein';
import { useResourceDrawer } from 'renderer/contexts/ResourceDrawerContext';

import ToolContainer from './ToolContainer';
import { CharacterCard, CharacterSettingsDialog } from '../Characters';

export default function CharactersTool() {
  const { openResourceDrawer } = useResourceDrawer();
  const [characters, setCharacters] = React.useState<Character[]>([]);
  const [settings, setSettings] = React.useState<CharacterSettings>({
    requiredAttributes: [],
  });
  const [searchTerm, setSearchTerm] = React.useState('');
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = React.useState(false);
  const [currentCharacter, setCurrentCharacter] =
    React.useState<Character | null>(null);
  const [formData, setFormData] = React.useState({
    name: '',
    avatarUuid: '',
    attributes: {} as Record<string, any>,
  });

  const loadCharacters = React.useCallback(async () => {
    try {
      const characterMap: CharacterMap =
        await window.electron.ipcRenderer.invoke('getCharacters');
      setCharacters(Object.values(characterMap));
    } catch (error: any) {
      EzSnackbarRef.error(
        `Failed to load characters: ${error.message ?? error}`
      );
    }
  }, []);

  const loadSettings = React.useCallback(async () => {
    try {
      const loadedSettings: CharacterSettings | null =
        await window.electron.ipcRenderer.invoke('getCharacterSettings');
      if (loadedSettings) {
        // Backward compatibility: ensure new fields have defaults
        const compatibleSettings = {
          ...loadedSettings,
          requiredAttributes: loadedSettings.requiredAttributes.map(
            (attr: any) => ({
              ...attr,
              inputType:
                attr.inputType ||
                (attr.type === 'boolean' ? 'checkbox' : 'input'),
              required: attr.required ?? false,
            })
          ),
        };
        setSettings(compatibleSettings);
      }
    } catch (error: any) {
      EzSnackbarRef.error(
        `Failed to load character settings: ${error.message ?? error}`
      );
    }
  }, []);

  React.useEffect(() => {
    loadCharacters();
    loadSettings();
  }, [loadCharacters, loadSettings]);

  const filteredCharacters = React.useMemo(() => {
    if (!searchTerm) return characters;

    return characters
      .map((char) => ({
        character: char,
        distance: levenshtein(
          searchTerm.toLowerCase(),
          char.name.toLowerCase()
        ),
      }))
      .filter(({ distance }) => distance < searchTerm.length)
      .sort((a, b) => a.distance - b.distance)
      .map(({ character }) => character);
  }, [characters, searchTerm]);

  const handleOpenCreateDialog = () => {
    setCurrentCharacter(null);
    setFormData({
      name: '',
      avatarUuid: '',
      attributes: {},
    });
    setEditDialogOpen(true);
  };

  const handleOpenEditDialog = (character: Character) => {
    setCurrentCharacter(character);
    setFormData({
      name: character.name,
      avatarUuid: character.avatarUuid || '',
      attributes: { ...character.attributes },
    });
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setCurrentCharacter(null);
  };

  const handleSaveCharacter = async () => {
    if (!formData.name.trim()) {
      EzSnackbarRef.warning('Please enter a character name');
      return;
    }

    // Validate required attributes
    const missingRequired = settings.requiredAttributes.filter(
      (attr) =>
        attr.required &&
        (formData.attributes[attr.key] === undefined ||
          formData.attributes[attr.key] === null ||
          formData.attributes[attr.key] === '')
    );

    if (missingRequired.length > 0) {
      const fieldNames = missingRequired.map((attr) => attr.label).join(', ');
      EzSnackbarRef.warning(`Please fill in required fields: ${fieldNames}`);
      return;
    }

    try {
      if (currentCharacter) {
        // Update existing character
        await window.electron.ipcRenderer.invoke(
          'updateCharacter',
          currentCharacter.id,
          {
            name: formData.name,
            avatarUuid: formData.avatarUuid || undefined,
            attributes: formData.attributes,
          }
        );
        EzSnackbarRef.success('Character updated');
      } else {
        // Create new character
        await window.electron.ipcRenderer.invoke(
          'createCharacter',
          formData.name,
          formData.avatarUuid || undefined,
          formData.attributes
        );
        EzSnackbarRef.success('Character created');
      }
      loadCharacters();
      handleCloseEditDialog();
    } catch (error: any) {
      EzSnackbarRef.error(
        `Failed to save character: ${error.message ?? error}`
      );
    }
  };

  const handleDeleteCharacter = async (character: Character) => {
    if (
      !window.confirm(`Are you sure you want to delete "${character.name}"?`)
    ) {
      return;
    }

    try {
      await window.electron.ipcRenderer.invoke('removeCharacter', character.id);
      EzSnackbarRef.success('Character deleted');
      loadCharacters();
    } catch (error: any) {
      EzSnackbarRef.error(
        `Failed to delete character: ${error.message ?? error}`
      );
    }
  };

  const handleSaveSettings = async (newSettings: CharacterSettings) => {
    try {
      await window.electron.ipcRenderer.invoke(
        'updateCharacterSettings',
        newSettings
      );
      setSettings(newSettings);
      EzSnackbarRef.success('Character settings updated');
    } catch (error: any) {
      EzSnackbarRef.error(
        `Failed to update settings: ${error.message ?? error}`
      );
    }
  };

  const headerControls = (
    <>
      <IconButton onClick={() => setSettingsDialogOpen(true)} size="small">
        <SettingsIcon />
      </IconButton>
      <IconButton onClick={handleOpenCreateDialog} size="small">
        <AddIcon />
      </IconButton>
    </>
  );

  return (
    <ToolContainer title="Characters" headerControls={headerControls}>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Search Bar */}
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search characters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>

        {/* Character Grid */}
        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
          {filteredCharacters.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                {searchTerm
                  ? 'No characters found'
                  : 'No characters created yet'}
              </Typography>
              {!searchTerm && (
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleOpenCreateDialog}
                  sx={{ mt: 2 }}
                >
                  Create Character
                </Button>
              )}
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filteredCharacters.map((character) => (
                <Grid item xs={12} md={6} lg={4} xl={3} key={character.id}>
                  <CharacterCard
                    character={character}
                    attributesToShow={settings.requiredAttributes}
                    onClick={handleOpenEditDialog}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>

      {/* Edit/Create Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {currentCharacter ? 'Edit Character' : 'Create Character'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              fullWidth
              required
            />

            <TextField
              label="Avatar"
              value={formData.avatarUuid}
              onChange={(e) =>
                setFormData({ ...formData, avatarUuid: e.target.value })
              }
              fullWidth
              placeholder="Select avatar from resources"
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <Button
                    size="small"
                    onClick={() =>
                      openResourceDrawer({
                        filterType: 'image',
                        onSelect: (uuid) => {
                          setFormData({ ...formData, avatarUuid: uuid });
                        },
                      })
                    }
                  >
                    Browse
                  </Button>
                ),
              }}
            />

            {/* Dynamic Attribute Fields */}
            {settings.requiredAttributes.map((attr) => {
              // Render different input types based on attr.inputType
              if (attr.inputType === 'checkbox' || attr.type === 'boolean') {
                return (
                  <FormControlLabel
                    key={attr.key}
                    control={
                      <Checkbox
                        checked={!!formData.attributes[attr.key]}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            attributes: {
                              ...formData.attributes,
                              [attr.key]: e.target.checked,
                            },
                          });
                        }}
                      />
                    }
                    label={`${attr.label}${attr.required ? ' *' : ''}`}
                  />
                );
              }

              if (attr.inputType === 'textarea') {
                return (
                  <TextField
                    key={attr.key}
                    label={`${attr.label}${attr.required ? ' *' : ''}`}
                    value={formData.attributes[attr.key] ?? ''}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        attributes: {
                          ...formData.attributes,
                          [attr.key]: e.target.value,
                        },
                      });
                    }}
                    fullWidth
                    multiline
                    rows={4}
                    required={attr.required}
                  />
                );
              }

              // Default: input type
              return (
                <TextField
                  key={attr.key}
                  label={`${attr.label}${attr.required ? ' *' : ''}`}
                  type={attr.type === 'number' ? 'number' : 'text'}
                  value={formData.attributes[attr.key] ?? ''}
                  onChange={(e) => {
                    let value = e.target.value as any;
                    if (attr.type === 'number') {
                      value = value ? Number(value) : '';
                    }
                    setFormData({
                      ...formData,
                      attributes: {
                        ...formData.attributes,
                        [attr.key]: value,
                      },
                    });
                  }}
                  fullWidth
                  required={attr.required}
                />
              );
            })}
          </Box>
        </DialogContent>
        <DialogActions>
          {currentCharacter && (
            <Button
              onClick={() => handleDeleteCharacter(currentCharacter)}
              color="error"
              sx={{ mr: 'auto' }}
            >
              Delete
            </Button>
          )}
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button onClick={handleSaveCharacter} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Settings Dialog */}
      <CharacterSettingsDialog
        open={settingsDialogOpen}
        settings={settings}
        onClose={() => setSettingsDialogOpen(false)}
        onSave={handleSaveSettings}
      />
    </ToolContainer>
  );
}
