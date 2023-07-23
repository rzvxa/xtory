import React from 'react';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import CloseIcon from '@mui/icons-material/Close';

import { ToolBoxContext } from './ToolBox';

interface ToolHeaderProps {
  title: string;
  height: string;
  controls?: React.ReactNode | undefined;
}

export default function ToolHeader({
  title,
  height,
  controls = undefined,
}: ToolHeaderProps) {
  const toolBoxContext = React.useContext(ToolBoxContext);

  return (
    <Paper
      sx={{
        height,
        display: 'flex',
        alignItems: 'center',
        pl: 1.5,
        bgcolor: (theme) => theme.palette.background.default,
      }}
    >
      <Typography variant="h6">{title}</Typography>
      <Box sx={{ display: 'flex', marginRight: 1, marginLeft: 'auto' }}>
        {controls}
        <IconButton
          aria-label="close-tool"
          sx={{ padding: 0, borderRadius: 0, ml: 2, pl: 1, pr: 1 }}
          onClick={toolBoxContext?.onClose}
        >
          <CloseIcon />
        </IconButton>
      </Box>
    </Paper>
  );
}
