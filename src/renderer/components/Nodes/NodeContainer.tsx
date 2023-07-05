import React from 'react';

import { styled } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

type NodeViewProps = {
  selected: boolean;
};

const NodeView = styled(Box)<NodeViewProps>`
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

export interface NodeContainerProps {
  containerRef: React.RefObject<HTMLElement> | undefined;
  title: string;
  selected: boolean;
  children: React.ReactNode;
}

export default React.memo(
  ({
    containerRef = undefined,
    title,
    selected,
    children,
  }: NodeContainerProps) => {
    return (
      <NodeView ref={containerRef} selected={selected}>
        <Paper sx={{ padding: 1 }}>
          <Typography variant="body2">{title}</Typography>
        </Paper>
        <Box sx={{ padding: 1 }}>{children}</Box>
      </NodeView>
    );
  }
);
