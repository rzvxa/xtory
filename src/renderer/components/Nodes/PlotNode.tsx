import React from 'react';

import { Handle, Position, NodeProps, useReactFlow, useStore } from 'reactflow';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import useInit from 'renderer/utils/useInit';

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

export default React.memo(({ id, data, selected }: NodeProps) => {
  const { setCenter } = useReactFlow();
  const node = useStore((s) => s.nodeInternals.get(id));
  const inputRef = React.useRef<HTMLInputElement>(null);

  const focusOnInput = React.useCallback(
    (resolve: undefined | (() => void) = undefined) => {
      // TODO find a better way than timeout,
      // TODO it won't work directy, messy workaround!
      setTimeout(() => {
        if (
          inputRef &&
          inputRef.current &&
          selected &&
          node &&
          node.width &&
          node.height
        ) {
          inputRef.current.focus();
          const x = node.position.x + node.width / 2;
          const y = node.position.y + node.height / 2;
          const zoom = 0.8;
          setCenter(x, y, { zoom, duration: 500 });
          if (resolve) resolve();
        }
      }, 100);
    },
    [inputRef, selected, node, setCenter]
  );

  useInit(focusOnInput);

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
      <TextField
        id="standard-basic"
        variant="outlined"
        multiline
        minRows="5"
        inputRef={inputRef}
        onClick={() => focusOnInput()}
      />
      <Handle type="source" position={Position.Right} />
    </NodeView>
  );
});
