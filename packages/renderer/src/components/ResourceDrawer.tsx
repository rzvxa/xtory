import React, { useState, useEffect, useMemo } from 'react';
import {
  Drawer,
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  Check as CheckIcon,
  Delete as DeleteIcon,
  DriveFileRenameOutline as RenameIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import type { ResourceMetadata, ResourceMap } from '@xtory/shared';
import { ChannelsMain } from '@xtory/shared';
import { levenshtein } from '../utils/levenshtein';
import logger from '../logger';
import { Z_INDEX } from '../constants/zIndex';

interface ResourceDrawerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (uuid: string) => void;
  filterType?: string;
}

export default function ResourceDrawer({
  open,
  onClose,
  onSelect,
  filterType = 'image',
}: ResourceDrawerProps) {
  const [resources, setResources] = useState<ResourceMap>({});
  const [editingUuid, setEditingUuid] = useState<string | null>(null);
  const [editDescription, setEditDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [renamingUuid, setRenamingUuid] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [deleteConfirmUuid, setDeleteConfirmUuid] = useState<string | null>(
    null
  );

  const loadResources = async () => {
    const allResources = await window.electron.ipcRenderer.invoke(
      ChannelsMain.getResources
    );
    setResources(allResources);
  };

  useEffect(() => {
    if (open) {
      loadResources();
    }
  }, [open]);

  const handleImport = async () => {
    try {
      const result = await window.electron.ipcRenderer.invoke(
        ChannelsMain.browseFileSystem,
        {
          properties: ['openFile'],
          filters: [
            {
              name: 'Images',
              extensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'],
            },
            { name: 'All Files', extensions: ['*'] },
          ],
        }
      );

      if (result.status === 'OK' && !result.canceled && result.filePaths?.[0]) {
        const uuid = await window.electron.ipcRenderer.invoke(
          ChannelsMain.importResource,
          result.filePaths[0],
          filterType
        );
        if (uuid) {
          await loadResources();
        } else {
          logger.error('Failed to import resource: No UUID returned', [
            'ResourceDrawer',
          ]);
        }
      }
    } catch (error) {
      logger.error(`Error importing resource: ${error}`, ['ResourceDrawer']);
    }
  };

  const handleSaveDescription = async (uuid: string) => {
    await window.electron.ipcRenderer.invoke(
      ChannelsMain.updateResourceMetadata,
      uuid,
      {
        description: editDescription,
      }
    );
    await loadResources();
    setEditingUuid(null);
    setEditDescription('');
  };

  const handleStartRename = (uuid: string, currentName: string) => {
    setRenamingUuid(uuid);
    setRenameValue(currentName);
  };

  const handleSaveRename = async (uuid: string) => {
    if (renameValue.trim()) {
      await window.electron.ipcRenderer.invoke(
        ChannelsMain.updateResourceMetadata,
        uuid,
        {
          originalName: renameValue,
        }
      );
      await loadResources();
    }
    setRenamingUuid(null);
    setRenameValue('');
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirmUuid) {
      await window.electron.ipcRenderer.invoke(
        ChannelsMain.removeResource,
        deleteConfirmUuid
      );
      await loadResources();
      setDeleteConfirmUuid(null);
    }
  };

  const handleStartEdit = (uuid: string, currentDescription?: string) => {
    setEditingUuid(uuid);
    setEditDescription(currentDescription || '');
  };

  const handleSelect = (uuid: string) => {
    onSelect(uuid);
    onClose();
  };

  // Fuzzy search using Levenshtein distance
  const filteredAndSearchedResources = useMemo(() => {
    const filtered = Object.entries(resources).filter(
      ([_, metadata]) => metadata.type === filterType
    );

    if (!searchQuery.trim()) {
      return filtered;
    }

    const query = searchQuery.toLowerCase();

    // Calculate Levenshtein distance for each resource
    const scored = filtered.map(([uuid, metadata]) => {
      const nameDistance = levenshtein(
        metadata.originalName.toLowerCase(),
        query
      );
      const descDistance = metadata.description
        ? levenshtein(metadata.description.toLowerCase(), query)
        : Infinity;

      // Use the minimum distance (best match)
      const distance = Math.min(nameDistance, descDistance);

      // Also check if query is a substring (exact match should rank higher)
      const nameIncludes = metadata.originalName.toLowerCase().includes(query);
      const descIncludes = metadata.description?.toLowerCase().includes(query);

      return {
        uuid,
        metadata,
        distance,
        exactMatch: nameIncludes || descIncludes,
      };
    });

    // Sort by exact matches first, then by distance
    scored.sort((a, b) => {
      if (a.exactMatch && !b.exactMatch) return -1;
      if (!a.exactMatch && b.exactMatch) return 1;
      return a.distance - b.distance;
    });

    // Only show results within reasonable distance (50% of query length or exact matches)
    const threshold = Math.max(query.length * 0.5, 3);
    return scored
      .filter((item) => item.exactMatch || item.distance <= threshold)
      .map((item) => [item.uuid, item.metadata] as [string, ResourceMetadata]);
  }, [resources, filterType, searchQuery]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{ zIndex: Z_INDEX.RESOURCE_DRAWER }}
    >
      <Box sx={{ width: 500, p: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant="h6">Resources</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          fullWidth
          onClick={handleImport}
          sx={{ mb: 2 }}
        >
          Import from Disk
        </Button>

        <TextField
          fullWidth
          size="small"
          placeholder="Search resources..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />

        <Grid container spacing={2}>
          {filteredAndSearchedResources.length === 0 ? (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary" align="center">
                {searchQuery
                  ? 'No matching resources found.'
                  : 'No resources yet. Import one to get started.'}
              </Typography>
            </Grid>
          ) : (
            filteredAndSearchedResources.map(([uuid, metadata]) => (
              <Grid item xs={12} key={uuid}>
                <Card>
                  {metadata.type === 'image' && (
                    <CardMedia
                      component="img"
                      height="140"
                      image={`resource://${uuid}`}
                      alt={metadata.originalName}
                      sx={{ objectFit: 'contain', bgcolor: '#f5f5f5' }}
                    />
                  )}
                  <CardContent>
                    {renamingUuid === uuid ? (
                      <TextField
                        fullWidth
                        size="small"
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleSaveRename(uuid);
                          }
                        }}
                        autoFocus
                      />
                    ) : (
                      <Typography variant="subtitle2" noWrap>
                        {metadata.originalName}
                      </Typography>
                    )}
                    {editingUuid === uuid ? (
                      <Box sx={{ mt: 1 }}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Description"
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          multiline
                          rows={2}
                        />
                      </Box>
                    ) : (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        {metadata.description || 'No description'}
                      </Typography>
                    )}
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {renamingUuid === uuid ? (
                        <Tooltip title="Save name">
                          <IconButton
                            size="small"
                            onClick={() => handleSaveRename(uuid)}
                            color="primary"
                          >
                            <CheckIcon />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Rename">
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleStartRename(uuid, metadata.originalName)
                            }
                          >
                            <RenameIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      {editingUuid === uuid ? (
                        <Tooltip title="Save description">
                          <IconButton
                            size="small"
                            onClick={() => handleSaveDescription(uuid)}
                            color="primary"
                          >
                            <CheckIcon />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Edit description">
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleStartEdit(uuid, metadata.description)
                            }
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => setDeleteConfirmUuid(uuid)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Button size="small" onClick={() => handleSelect(uuid)}>
                      Select
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmUuid !== null}
        onClose={() => setDeleteConfirmUuid(null)}
        sx={{ zIndex: Z_INDEX.CONFIRMATION_DIALOG }}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this resource? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmUuid(null)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Drawer>
  );
}
