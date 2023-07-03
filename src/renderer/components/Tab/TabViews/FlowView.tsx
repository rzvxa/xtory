import React from 'react';

import ReactFlow, {
  ReactFlowProvider,
  useViewport,
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
} from 'reactflow';

import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

import uuidv4 from 'renderer/utils/uuidv4';
import { rendererPointToPoint } from 'renderer/utils/flowUtils';

import { ContextMenu, ContextMenuItem } from 'renderer/components/ContextMenu';

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

function Flow() {
  const viewport = useViewport();

  const reactFlowRef = React.useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [contextMenu, setContextMenu] = React.useState<{
    x: number;
    y: number;
  } | null>(null);
  const [searchText, setSearchText] = React.useState<string>('');

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
            x: left + transformedPos.x - (selected.width! / 2) * zoom,
            y: top + transformedPos.y,
          });
        } else {
          const newNode = {
            id: uuidv4(),
            type: 'custom',
            data: { label: 'node cusds' },
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

  const focusOnContextSearch = React.useCallback((input: HTMLInputElement) => {
    if (input) {
      input.blur();
      setTimeout(() => input && input.focus());
    }
    console.log('he', input);
  }, []);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            x: event.clientX - 200,
            y: event.clientY - 60,
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
      <ContextMenu
        open={contextMenu !== null}
        onClose={() => {
          setContextMenu(null);
          setSearchText('');
        }}
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.y, left: contextMenu.x }
            : undefined
        }
        variant="menu"
      >
        <TextField
          placeholder="Search for node..."
          autoFocus
          inputRef={focusOnContextSearch}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{ width: '100%', padding: 1 }}
          onKeyDown={(e) => {
            if (e.key !== 'Escape') e.stopPropagation();
          }}
        />
        {items
          .filter((i) => i.toLowerCase().includes(searchText.toLowerCase()))
          .map((i) => (
            <ContextMenuItem label={i} />
          ))}
      </ContextMenu>
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
