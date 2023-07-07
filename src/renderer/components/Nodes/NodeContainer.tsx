import React from 'react';

import { styled } from '@mui/material/styles';
import { useStore } from 'reactflow';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import useDynamicFontSize from './useDynamicFontSize';

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
  title: string;
  selected: boolean;
  children: React.ReactNode;
}

const fontSelector = (s: any) => Math.max(Math.min(1 / s.transform[2], 6), 0.4);

export default React.memo(
  ({ title, selected, children }: NodeContainerProps) => {
    const fontSize = useStore(fontSelector);

    return (
      <NodeView selected={selected}>
        <Paper sx={{ padding: 1 }}>
          <Typography
            variant="body2"
            sx={{
              fontSize: `${fontSize}rem`,
              textOverflow: 'ellipsis',
              overflow: 'clip',
              width: '200px',
            }}
          >
            {title}
          </Typography>
        </Paper>
        <Box sx={{ padding: 1 }}>{children}</Box>
      </NodeView>
    );
  }
);
