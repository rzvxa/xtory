import React from 'react';

import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';

import ToolContainer from './ToolContainer';

export default function ConsoleTool() {
  return (
    <ToolContainer title="Console">
      <Box
        sx={{
          cursor: 'text',
          display: 'flex',
          flexDirection: 'column-reverse',
          height: '100%',
          width: '100%',
          border: 'none',
          backgroundColor: (theme) => theme.palette.background.paper,
        }}
      >
        <InputBase readOnly multiline fullWidth />
      </Box>
    </ToolContainer>
  );
}
