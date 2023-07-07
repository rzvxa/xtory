import React from 'react';

import { useStore } from 'reactflow';

import Box from '@mui/material/Box';
import TextField, { TextFieldProps } from '@mui/material/TextField';

const fontSelector = (zoom: number) => Math.max(Math.min(1 / zoom, 5), 0.4);

export default function TextArea({ inputRef, ...rest }: TextFieldProps) {
  const zoomSize = useStore((s: any) => s.transform[2]);
  const preview = zoomSize < 0.5;

  return (
    <Box sx={{ position: 'relative', width: '200px' }}>
      <pre
        style={{
          margin: 0,
          position: 'absolute',
          overflow: 'clip',
          textOverflow: 'ellipsis',
          whiteSpace: 'pre-wrap',
          visibility: preview ? 'inherit' : 'hidden',
          width: '100%',
          height: '100%',
          fontSize: `${fontSelector(zoomSize)}rem`,
          lineHeight: '1',
        }}
      >
        {inputRef?.current?.value}
      </pre>

      <TextField
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...rest}
        inputRef={inputRef}
        sx={{ width: '100%', visibility: preview ? 'hidden' : 'inherit' }}
      />
    </Box>
  );
}
