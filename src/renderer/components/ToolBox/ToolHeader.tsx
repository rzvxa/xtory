import React from 'react';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import CloseIcon from '@mui/icons-material/Close';

import { ToolBoxContext } from './ToolBox';

interface ToolHeaderProps {
  title: string;
  height: string;
}

export default function ToolHeader({ title, height }: ToolHeaderProps) {
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
      <IconButton
        aria-label="close-tool"
        sx={{ marginRight: 1, marginLeft: 'auto', borderRadius: 0, padding: 0 }}
        onClick={toolBoxContext?.onClose}
      >
        <CloseIcon />
      </IconButton>
    </Paper>
  );
}
