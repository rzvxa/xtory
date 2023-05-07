import React from 'react';

import Box from '@mui/material/Box';
import ToolHeader from './ToolHeader';
import ProjectTree from '../ProjectTree';

export default function ProjectTool() {
  return (
    <>
      <ToolHeader title="Project" />

      <Box sx={{ height: '100%', flexGrow: 1, overflowY: 'auto' }} pt={0.1}>
        <ProjectTree />
      </Box>
    </>
  );
}
