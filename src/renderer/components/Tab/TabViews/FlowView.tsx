import React from 'react';

import ReactFlow, {
  ReactFlowProvider,
  useViewport,
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
  Controls,
  MarkerType,
  Background,
  BackgroundVariant,
} from 'reactflow';

import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

import uuidv4 from 'renderer/utils/uuidv4';
import {
  rendererPointToPoint,
  pointToRendererPoint,
} from 'renderer/utils/flowUtils';

import { NodeDrawer, NodeDrawerItem } from 'renderer/components/NodeDrawer';

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

const edgeSharedSettings = {
  markerEnd: { type: MarkerType.ArrowClosed, width: 6 },
};

const initialEdges = [
  {
    id: 'e1',
    source: '1',
    target: '2',
    ...edgeSharedSettings,
  },
];

const nodeTypes = {
  custom: PlotNode,
};

const ReactFlowStyled = styled(ReactFlow)`
  background-color: ${({ theme }) => theme.palette.background.default};
  .react-flow__edge-path {
    stroke: ${({ theme }) => theme.palette.text.primary};
    stroke-width: 6px;
  }
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

function Flow() {
  const viewport = useViewport();

  const reactFlowRef = React.useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [contextMenu, setContextMenu] = React.useState<{
    x: number;
    y: number;
    type: 'rclick' | 'extend';
  } | null>(null);

  const handleKeyPress = React.useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Enter' && event.ctrlKey) {
        const selectedNodes = nodes.filter((node) => node.selected);
        if (selectedNodes.length === 0) return;
        if (selectedNodes.length > 1) return;
        const selected = selectedNodes[0];
        if (event.shiftKey) {
          const { x, y, zoom } = viewport;
          const { top, left } = reactFlowRef.current!.getBoundingClientRect();
          const transformedPos = rendererPointToPoint(selected.position, [
            x,
            y,
            zoom,
          ]);

          setContextMenu({
            x: left + transformedPos.x,
            y: top + transformedPos.y,
            type: 'extend',
          });
        } else {
          const newNode = {
            id: uuidv4(),
            type: 'custom',
            data: { label: 'node cusds', focusOnInit: true },
            position: { x: selected.position.x + 400, y: selected.position.y },
            selected: true,
          };
          selected.selected = false;
          setNodes((nds) => nds.concat(newNode));
          setEdges((eds) =>
            eds.concat({
              id: uuidv4(),
              source: selected.id,
              target: newNode.id,
              ...edgeSharedSettings,
            })
          );
        }
      }
    },
    [nodes, setNodes, setEdges, viewport]
  );

  React.useEffect(() => {
    // attach the event listener
    document.addEventListener('keydown', handleKeyPress);

    // remove the event listener
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  const onConnect = React.useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeDrawerItemSelected = React.useCallback(
    (item: string) => {
      if (!contextMenu) return;
      const selectedNodes = nodes.filter((node) => node.selected);
      const prevNode = selectedNodes.length === 1 ? selectedNodes[0] : null;
      const extend = contextMenu.type === 'extend';
      const { top, left } = reactFlowRef.current!.getBoundingClientRect();
      const { x, y, zoom } = viewport;
      const screenPosition = {
        x: contextMenu.x - left,
        y: contextMenu.y - top,
      };
      const position = pointToRendererPoint(
        screenPosition,
        [x, y, zoom],
        false,
        [0, 0]
      );
      if (extend) {
        position.x += 400;
      }
      const newNode = {
        id: uuidv4(),
        type: 'custom',
        data: { label: 'node cusds', focusOnInit: extend },
        position,
        selected: true,
      };
      selectedNodes.forEach((node) => {
        node.selected = false;
      });
      setNodes((nds) => nds.concat(newNode));
      if (extend) {
        setEdges((eds) =>
          eds.concat({
            id: uuidv4(),
            source: prevNode?.id,
            target: prevNode ? newNode.id : '',
            ...edgeSharedSettings,
          })
        );
      }
    },
    [contextMenu, nodes, setNodes, setEdges, viewport]
  );

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            x: event.clientX,
            y: event.clientY,
            type: 'rclick',
          }
        : null
    );
  };
  const items = [
    'Plot',
    'Conversation',
    'Node',
    'Banana',
    'Pie',
    'WOwe2',
    'Test',
    'Note',
  ];

  return (
    <ReactFlowStyled
      ref={reactFlowRef}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      proOptions={{ hideAttribution: true }}
      minZoom={0.1}
      onContextMenu={handleContextMenu}
      fitView
    >
      <Background
        id="1"
        gap={100}
        lineWidth={0.1}
        color="#f1f1f1"
        variant={BackgroundVariant.Lines}
      />
      <Background
        id="2"
        gap={1000}
        offset={1}
        color="#ccc"
        variant={BackgroundVariant.Lines}
      />
      <NodeDrawer
        items={items}
        open={contextMenu !== null}
        onClose={() => setContextMenu(null)}
        onItemSelected={onNodeDrawerItemSelected}
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.y, left: contextMenu.x }
            : undefined
        }
      />
      <ControlsStyled />
    </ReactFlowStyled>
  );
}

export default function FlowView() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
