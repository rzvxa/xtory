import React from 'react';

import { Handle, Position, NodeProps } from 'reactflow';
import TextField from '@mui/material/TextField';
import useInit from 'renderer/utils/useInit';

import NodeContainer from './NodeContainer';
import useFocusAndCenter from './useFocusAndCenter';

export default React.memo(({ id, data, selected }: NodeProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const focusAndCenter = useFocusAndCenter(inputRef, id, selected);

  useInit(focusAndCenter);

  return (
    <NodeContainer title="Plot" selected={selected}>
      <Handle type="target" position={Position.Left} />
      <TextField
        id="standard-basic"
        variant="outlined"
        multiline
        minRows="5"
        inputRef={inputRef}
        onClick={() => focusAndCenter()}
      />
      <Handle type="source" position={Position.Right} />
    </NodeContainer>
  );
});
