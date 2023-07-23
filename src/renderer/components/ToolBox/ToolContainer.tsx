import React from 'react';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

import ToolHeader from './ToolHeader';

export interface ProjectToolProps {
  title: string;
  headerControls?: React.ReactNode | undefined;
  children: React.ReactNode;
}

const toolHeaderHeight = '40px';

export default function ProjectTool({
  title,
  headerControls = undefined,
  children,
}: ProjectToolProps) {
  return (
    <Paper sx={{ height: '100%' }}>
      <ToolHeader
        title={title}
        height={toolHeaderHeight}
        controls={headerControls}
      />

      <Box
        sx={{
          height: `calc(100% - ${toolHeaderHeight})`,
          flexGrow: 1,
          overflowY: 'auto',
        }}
        pt={0.1}
      >
        {children}
      </Box>
    </Paper>
  );
}
