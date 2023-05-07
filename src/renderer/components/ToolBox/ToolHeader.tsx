import React from 'react';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

interface ToolHeaderProps {
  title: string;
}

export default function ToolHeader({ title }: ToolHeaderProps) {
  return (
    <Paper
      sx={{
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        pl: 1.5,
        bgcolor: (theme) => theme.palette.background.default,
      }}
    >
      <Typography variant="h6">{title}</Typography>
    </Paper>
  );
}
