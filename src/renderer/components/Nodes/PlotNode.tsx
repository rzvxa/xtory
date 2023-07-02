import React from 'react';

import { Handle, Position, NodeProps } from 'reactflow';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

type NodeViewProps = {
  selected: boolean;
};

const NodeView = styled(Box)<NodeViewProps>`
  padding: 10px 20px;
  border-radius: 5px;
  background: ${({ theme }) => theme.palette.background.paper};
  color: ${({ theme }) => theme.palette.text.primary};
  border: 1px solid
    ${({ selected, theme }) =>
      selected ? theme.palette.secondary.main : theme.palette.primary.main};

  .react-flow__handle {
    background: ${({ theme }) => theme.palette.primary.main};
    width: 8px;
    height: 10px;
    border-radius: 3px;
  }
`;

export default React.memo(({ data, selected }: NodeProps) => {
  console.log(data);
  return (
    <NodeView selected={selected}>
      <Handle type="target" position={Position.Left} />
      <Typography
        variant="body2"
        sx={{
          width: 'fit-content',
          color: (theme) => theme.palette.text.disabled,
          backgroundColor: (theme) => theme.palette.background.paper,
          marginTop: -0.5,
          marginLeft: -1,
        }}
      >
        Plot
      </Typography>
      <TextField id="standard-basic" variant="outlined" multiline minRows="5" />
      <Handle type="source" position={Position.Right} />
    </NodeView>
  );
});
