import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import FormLabel from '@mui/material/FormLabel';

import type {
  CharacterSettings,
  CharacterAttributeDefinition,
} from '@xtory/shared';

interface CharacterSettingsDialogProps {
  open: boolean;
  settings: CharacterSettings;
  onClose: () => void;
  onSave: (settings: CharacterSettings) => void;
}

export default function CharacterSettingsDialog({
  open,
  settings,
  onClose,
  onSave,
}: CharacterSettingsDialogProps) {
  const [localSettings, setLocalSettings] =
    React.useState<CharacterSettings>(settings);

  React.useEffect(() => {
    // Add temporary IDs for stable React keys
    const settingsWithIds = {
      ...settings,
      requiredAttributes: settings.requiredAttributes.map((attr: any) => ({
        ...attr,
        _tempId: attr._tempId || `${Date.now()}-${Math.random()}`,
      })),
    };
    setLocalSettings(settingsWithIds);
  }, [settings]);

  const handleAddAttribute = () => {
    const newAttr: CharacterAttributeDefinition = {
      key: '',
      label: '',
      type: 'text',
      inputType: 'input',
      required: false,
      showInCard: false,
      _tempId: `${Date.now()}-${Math.random()}`,
    } as any;
    setLocalSettings({
      ...localSettings,
      requiredAttributes: [...localSettings.requiredAttributes, newAttr],
    });
  };

  const handleRemoveAttribute = (index: number) => {
    const newAttrs = [...localSettings.requiredAttributes];
    newAttrs.splice(index, 1);
    setLocalSettings({
      ...localSettings,
      requiredAttributes: newAttrs,
    });
  };

  const handleMoveAttribute = (index: number, direction: 'up' | 'down') => {
    const newAttrs = [...localSettings.requiredAttributes];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newAttrs.length) return;

    // Swap elements
    [newAttrs[index], newAttrs[targetIndex]] = [
      newAttrs[targetIndex],
      newAttrs[index],
    ];

    setLocalSettings({
      ...localSettings,
      requiredAttributes: newAttrs,
    });
  };

  const handleUpdateAttribute = (
    index: number,
    updates: Partial<CharacterAttributeDefinition>
  ) => {
    const newAttrs = [...localSettings.requiredAttributes];
    const updatedAttr = { ...newAttrs[index], ...updates };

    // Auto-adjust inputType based on type
    if (updates.type === 'boolean') {
      updatedAttr.inputType = 'checkbox';
    } else if (
      updates.type === 'number' &&
      updatedAttr.inputType === 'textarea'
    ) {
      updatedAttr.inputType = 'input';
    }

    newAttrs[index] = updatedAttr;
    setLocalSettings({
      ...localSettings,
      requiredAttributes: newAttrs,
    });
  };

  const handleSave = () => {
    // Filter out empty attributes and remove temporary IDs
    const validAttrs = localSettings.requiredAttributes
      .filter((attr) => attr.key.trim() && attr.label.trim())
      .map((attr: any) => {
        const { _tempId, ...attrWithoutTempId } = attr;
        return attrWithoutTempId;
      });
    onSave({
      ...localSettings,
      requiredAttributes: validAttrs,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Character Attribute Settings</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddAttribute}
            fullWidth
          >
            Add Attribute
          </Button>
        </Box>

        <List>
          {localSettings.requiredAttributes.map((attr: any, index) => (
            <ListItem
              key={attr._tempId || index}
              sx={{
                display: 'flex',
                gap: 1,
                flexDirection: 'column',
                alignItems: 'stretch',
                mb: 2,
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                p: 2,
              }}
            >
              {/* Reorder buttons and Key/Label */}
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <IconButton
                    onClick={() => handleMoveAttribute(index, 'up')}
                    disabled={index === 0}
                    size="small"
                  >
                    <ArrowUpwardIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleMoveAttribute(index, 'down')}
                    disabled={
                      index === localSettings.requiredAttributes.length - 1
                    }
                    size="small"
                  >
                    <ArrowDownwardIcon />
                  </IconButton>
                </Box>
                <TextField
                  label="Key"
                  value={attr.key}
                  onChange={(e) =>
                    handleUpdateAttribute(index, { key: e.target.value })
                  }
                  size="small"
                  fullWidth
                  placeholder="e.g., sex, age"
                />
                <TextField
                  label="Label"
                  value={attr.label}
                  onChange={(e) =>
                    handleUpdateAttribute(index, { label: e.target.value })
                  }
                  size="small"
                  fullWidth
                  placeholder="Display name"
                />
              </Box>

              {/* Type selection */}
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <FormLabel sx={{ minWidth: 80 }}>Data Type:</FormLabel>
                <Select
                  value={attr.type}
                  onChange={(e) =>
                    handleUpdateAttribute(index, {
                      type: e.target.value as 'text' | 'number' | 'boolean',
                    })
                  }
                  size="small"
                  sx={{ minWidth: 120 }}
                >
                  <MenuItem value="text">Text</MenuItem>
                  <MenuItem value="number">Number</MenuItem>
                  <MenuItem value="boolean">Boolean</MenuItem>
                </Select>
              </Box>

              {/* Input type selection */}
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <FormLabel sx={{ minWidth: 80 }}>Input Type:</FormLabel>
                <Select
                  value={attr.inputType}
                  onChange={(e) =>
                    handleUpdateAttribute(index, {
                      inputType: e.target.value as
                        | 'input'
                        | 'textarea'
                        | 'checkbox',
                    })
                  }
                  size="small"
                  sx={{ minWidth: 120 }}
                  disabled={attr.type === 'boolean'}
                >
                  <MenuItem value="input">Single Line</MenuItem>
                  {attr.type === 'text' && (
                    <MenuItem value="textarea">Multi Line (Textarea)</MenuItem>
                  )}
                  {attr.type === 'boolean' && (
                    <MenuItem value="checkbox">Checkbox</MenuItem>
                  )}
                </Select>
              </Box>

              {/* Options */}
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={attr.required}
                      onChange={(e) =>
                        handleUpdateAttribute(index, {
                          required: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Required"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={attr.showInCard}
                      onChange={(e) =>
                        handleUpdateAttribute(index, {
                          showInCard: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Show in card"
                />

                <Box sx={{ flexGrow: 1 }} />

                <IconButton
                  onClick={() => handleRemoveAttribute(index)}
                  color="error"
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
