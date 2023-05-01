import React from 'react';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

interface ToolHeaderProps {
  title: string;
}

export default function ToolHeader({ title }: ToolHeaderProps) {
  return (
    <>
      <Box
        sx={{ height: '40px', display: 'flex', alignItems: 'center', ml: 1.5 }}
      >
        <Typography variant="h6">{title}</Typography>
      </Box>
      <Divider sx={{ mb: 1.5 }} />
    </>
  );
}
