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
    setLocalSettings(settings);
  }, [settings]);

  const handleAddAttribute = () => {
    const newAttr: CharacterAttributeDefinition = {
      key: '',
      label: '',
      type: 'text',
      showInCard: false,
    };
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

  const handleUpdateAttribute = (
    index: number,
    updates: Partial<CharacterAttributeDefinition>
  ) => {
    const newAttrs = [...localSettings.requiredAttributes];
    newAttrs[index] = { ...newAttrs[index], ...updates };
    setLocalSettings({
      ...localSettings,
      requiredAttributes: newAttrs,
    });
  };

  const handleSave = () => {
    // Filter out empty attributes
    const validAttrs = localSettings.requiredAttributes.filter(
      (attr) => attr.key.trim() && attr.label.trim()
    );
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
          {localSettings.requiredAttributes.map((attr, index) => (
            <ListItem
              key={index}
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
              <Box sx={{ display: 'flex', gap: 1 }}>
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

              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
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
