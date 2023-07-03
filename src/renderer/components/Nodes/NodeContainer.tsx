import React from 'react';

import { styled } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

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

export interface NodeContainerProps {
  title: string;
  selected: boolean;
  children: React.ReactNode;
}

export default React.memo(
  ({ title, selected, children }: NodeContainerProps) => {
    return (
      <NodeView selected={selected}>
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
          {title}
        </Typography>
        {children}
      </NodeView>
    );
  }
);
