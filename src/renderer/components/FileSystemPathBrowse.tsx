import React from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

import FolderIcon from '@mui/icons-material/Folder';

import { sanitizePath } from 'renderer/utils';
import { ChannelsMain, BrowseFileSystemResult } from 'shared/types';

interface FileSystemPathBrowseProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error: boolean | undefined;
  helperText: string | undefined;
}

export default function FileSystemPathBrowse({
  label,
  placeholder,
  value,
  onChange,
  error,
  helperText,
}: FileSystemPathBrowseProps) {
  const onBrowseClick = async () => {
    const result: BrowseFileSystemResult =
      await window.electron.ipcRenderer.invoke(ChannelsMain.browseFileSystem, {
        properties: ['openDirectory'],
      });
    if (result.canceled) {
      return;
    }
    const output = sanitizePath(result.filePaths[0]);
    onChange(output);
  };

  return (
    <Box onClick={onBrowseClick} sx={{ width: '100%' }}>
      <TextField
        sx={{ width: '100%' }}
        label={value && label}
        placeholder={placeholder}
        value={value}
        InputProps={{
          readOnly: true,
          'aria-label': 'path-textfield',
          endAdornment: (
            <InputAdornment position="end">
              <IconButton>
                <FolderIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        error={error}
        helperText={helperText}
      />
    </Box>
  );
}
