import React from 'react';

import Box from '@mui/material/Box';
import Input from '@mui/material/Input';

import { FileTabData } from 'renderer/state/types/tabs/index';

export interface DefaultFileViewProps {
  tabData: FileTabData;
}

export default function DefaultFileView({ tabData }: DefaultFileViewProps) {
  return (
    <Box>
      <Input
        id="standard-basic"
        value={tabData.content}
        multiline
        sx={{
          height: '100%',
          width: '100%',
          '.MuiInputBase-root': {
            height: '100%',
        },
        }}
      />
    </Box>
  );
}
