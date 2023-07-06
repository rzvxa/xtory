import React from 'react';

import { Handle, Position, NodeProps } from 'reactflow';
import TextField from '@mui/material/TextField';
import useInit from 'renderer/hooks/useInit';

import NodeContainer from './NodeContainer';
import useFocusAndCenter from './useFocusAndCenter';

export default React.memo(({ id, data, selected }: NodeProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const focusAndCenter = useFocusAndCenter(inputRef, id, selected);

  useInit(focusAndCenter);

  return (
    <NodeContainer title="Note" selected={selected}>
      <TextField
        id="standard-basic"
        variant="outlined"
        multiline
        minRows="5"
        inputRef={inputRef}
      />
    </NodeContainer>
  );
});
