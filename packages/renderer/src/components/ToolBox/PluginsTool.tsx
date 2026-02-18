import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

import { ChannelsMain } from '@xtory/shared';
import { EzSnackbarRef } from 'renderer/utils/ezSnackbar';

import ToolContainer from './ToolContainer';

interface Plugin {
  name: string;
  version: string;
  enabled: boolean;
}

export default function PluginsTool() {
  const [plugins, setPlugins] = React.useState<Plugin[]>([]);
  const [newPluginName, setNewPluginName] = React.useState('');
  const [newPluginVersion, setNewPluginVersion] = React.useState('*');
  const [hasChanges, setHasChanges] = React.useState(false);

  const loadPlugins = React.useCallback(async () => {
    try {
      const config: {
        plugins: { [name: string]: string };
        pluginsConfiguration: { [name: string]: { enabled?: boolean } };
      } = await window.electron.ipcRenderer.invoke(
        ChannelsMain.getPluginConfig
      );
      const pluginList: Plugin[] = Object.entries(config.plugins || {}).map(
        ([name, version]) => ({
          name,
          version: version as string,
          enabled: config.pluginsConfiguration?.[name]?.enabled !== false,
        })
      );
      setPlugins(pluginList);
      setHasChanges(false);
    } catch (error: any) {
      EzSnackbarRef.error(`Failed to load plugins: ${error.message ?? error}`);
    }
  }, []);

  React.useEffect(() => {
    // Load plugins on mount
    loadPlugins();
  }, [loadPlugins]);

  const handleTogglePlugin = async (pluginName: string) => {
    const updatedPlugins = plugins.map((p) =>
      p.name === pluginName ? { ...p, enabled: !p.enabled } : p
    );
    setPlugins(updatedPlugins);
    setHasChanges(true);

    const plugin = updatedPlugins.find((p) => p.name === pluginName);
    if (!plugin) return;

    try {
      await window.electron.ipcRenderer.invoke(
        ChannelsMain.updatePluginEnabled,
        pluginName,
        plugin.enabled
      );
    } catch (error: any) {
      EzSnackbarRef.error(`Failed to update plugin: ${error.message ?? error}`);
      loadPlugins(); // Reload on error
    }
  };

  const handleAddPlugin = async () => {
    if (!newPluginName.trim()) {
      EzSnackbarRef.warning('Please enter a plugin name');
      return;
    }

    if (plugins.some((p) => p.name === newPluginName)) {
      EzSnackbarRef.warning('Plugin already exists');
      return;
    }

    const updatedPlugins = [
      ...plugins,
      { name: newPluginName, version: newPluginVersion, enabled: true },
    ];
    setPlugins(updatedPlugins);
    setNewPluginName('');
    setNewPluginVersion('*');
    setHasChanges(true);

    const pluginConfig = updatedPlugins.reduce(
      (acc, p) => ({ ...acc, [p.name]: p.version }),
      {}
    );

    try {
      await window.electron.ipcRenderer.invoke(
        ChannelsMain.updatePluginConfig,
        pluginConfig
      );
      EzSnackbarRef.success('Plugin added');
    } catch (error: any) {
      EzSnackbarRef.error(`Failed to add plugin: ${error.message ?? error}`);
      loadPlugins(); // Reload on error
    }
  };

  const handleRemovePlugin = async (pluginName: string) => {
    const updatedPlugins = plugins.filter((p) => p.name !== pluginName);
    setPlugins(updatedPlugins);
    setHasChanges(true);

    const pluginConfig = updatedPlugins.reduce(
      (acc, p) => ({ ...acc, [p.name]: p.version }),
      {}
    );

    try {
      await window.electron.ipcRenderer.invoke(
        ChannelsMain.updatePluginConfig,
        pluginConfig
      );
      EzSnackbarRef.success('Plugin removed');
    } catch (error: any) {
      EzSnackbarRef.error(`Failed to remove plugin: ${error.message ?? error}`);
      loadPlugins(); // Reload on error
    }
  };

  const handleVersionChange = async (
    pluginName: string,
    newVersion: string
  ) => {
    const updatedPlugins = plugins.map((p) =>
      p.name === pluginName ? { ...p, version: newVersion } : p
    );
    setPlugins(updatedPlugins);
    setHasChanges(true);

    const pluginConfig = updatedPlugins.reduce(
      (acc, p) => ({ ...acc, [p.name]: p.version }),
      {}
    );

    try {
      await window.electron.ipcRenderer.invoke(
        ChannelsMain.updatePluginConfig,
        pluginConfig
      );
    } catch (error: any) {
      EzSnackbarRef.error(
        `Failed to update plugin version: ${error.message ?? error}`
      );
      loadPlugins(); // Reload on error
    }
  };

  const handleRestart = async () => {
    try {
      await window.electron.ipcRenderer.invoke(ChannelsMain.restartApp);
    } catch (error: any) {
      EzSnackbarRef.error(
        `Failed to restart application: ${error.message ?? error}`
      );
    }
  };

  return (
    <ToolContainer title="Plugins">
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Add Plugin Section */}
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Add Plugin
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
            <TextField
              size="small"
              fullWidth
              placeholder="@xtory/plugin-name"
              label="Package Name"
              value={newPluginName}
              onChange={(e) => setNewPluginName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddPlugin();
                }
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              size="small"
              fullWidth
              placeholder="*"
              label="Version"
              value={newPluginVersion}
              onChange={(e) => setNewPluginVersion(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddPlugin();
                }
              }}
            />
            <IconButton color="primary" onClick={handleAddPlugin}>
              <AddIcon />
            </IconButton>
          </Box>
        </Box>

        <Divider />

        {/* Plugin List */}
        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          {plugins.length === 0 ? (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No plugins configured
              </Typography>
            </Box>
          ) : (
            <List>
              {plugins.map((plugin) => (
                <ListItem
                  key={plugin.name}
                  sx={{ flexDirection: 'column', alignItems: 'stretch', py: 2 }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                      mb: 1,
                    }}
                  >
                    <ListItemText
                      primary={plugin.name}
                      secondary={`Version: ${plugin.version}`}
                      sx={{ flexGrow: 1 }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Switch
                        edge="end"
                        checked={plugin.enabled}
                        onChange={() => handleTogglePlugin(plugin.name)}
                      />
                      <IconButton
                        edge="end"
                        onClick={() => handleRemovePlugin(plugin.name)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  <TextField
                    size="small"
                    fullWidth
                    label="Version"
                    value={plugin.version}
                    onChange={(e) =>
                      handleVersionChange(plugin.name, e.target.value)
                    }
                    placeholder="*"
                    disabled={!plugin.enabled}
                  />
                  <Divider sx={{ mt: 2 }} />
                </ListItem>
              ))}
            </List>
          )}
        </Box>

        {/* Restart Section */}
        {hasChanges && (
          <>
            <Divider />
            <Box sx={{ p: 2 }}>
              <Typography variant="body2" color="warning.main" sx={{ mb: 1 }}>
                Restart required for changes to take effect
              </Typography>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                startIcon={<RestartAltIcon />}
                onClick={handleRestart}
              >
                Restart Application
              </Button>
            </Box>
          </>
        )}
      </Box>
    </ToolContainer>
  );
}
