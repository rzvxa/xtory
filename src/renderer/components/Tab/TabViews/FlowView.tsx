import React from 'react';

import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
  Controls,
  Panel,
} from 'reactflow';
import { styled } from '@mui/material/styles';

import PlotNode from 'renderer/components/Nodes/PlotNode';

import 'reactflow/dist/style.css';

const initialNodes = [
  {
    id: '1',
    type: 'custom',
    data: { label: 'Node 1' },
    position: { x: 0, y: 0 },
  },
  {
    id: '2',
    type: 'custom',
    data: { label: 'Node 2' },
    position: { x: 400, y: 0 },
  },
];

const initialEdges = [
  {
    id: 'e1',
    source: '1',
    target: '2',
  },
];

const nodeTypes = {
  custom: PlotNode,
};

const ReactFlowStyled = styled(ReactFlow)`
  background-color: ${({ theme }) => theme.palette.background.default};
`;

const MiniMapStyled = styled(MiniMap)`
  background-color: ${({ theme }) => theme.palette.background.default};

  .react-flow__minimap-mask {
    fill: ${({ theme }) => theme.palette.background.paper};
  }

  .react-flow__minimap-node {
    fill: ${({ theme }) => theme.palette.background.paper};
    stroke: ${({ theme }) => theme.palette.primary.main};
  }
`;

const ControlsStyled = styled(Controls)`
  button {
    background-color: ${({ theme }) => theme.palette.background.paper};
    color: ${({ theme }) => theme.palette.primary.main};
    border-bottom: 1px solid ${({ theme }) => theme.palette.primary.main};

    &:hover {
      background-color: ${({ theme }) => theme.palette.primary.main};
      color: ${({ theme }) => theme.palette.secondary.main};
    }

    path {
      fill: currentColor;
    }
  }
`;

export default function FlowView() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = React.useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <ReactFlowStyled
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      proOptions={{ hideAttribution: true }}
      fitView
    >
      <MiniMapStyled ariaLabel="MiniMap" />
      <ControlsStyled />
    </ReactFlowStyled>
  );
}
