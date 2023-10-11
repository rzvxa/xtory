import React from 'react';

import ReactFlow, {
  ReactFlowInstance,
  ReactFlowProvider,
  useViewport,
  addEdge,
  Controls,
  MarkerType,
  Background,
  BackgroundVariant,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

import { ChannelsMain, uuidv4 } from '@xtory/shared';
import { FlowViewConfig } from '@xtory/shared/types/plugin';

import { useAppSelector, useAppDispatch } from 'renderer/state/store/index';
import { setFlowState } from 'renderer/state/store/tabs';
import { FileTabData, FlowState } from 'renderer/state/types';

import useUndoRedo from 'renderer/hooks/useUndoRedo';
import useCenterOnNode from 'renderer/hooks/useCenterOnNode';

import {
  rendererPointToPoint,
  pointToRendererPoint,
} from 'renderer/utils/flowUtils';

import { NodeDrawer } from 'renderer/components/NodeDrawer';

import PlotNode from 'renderer/components/Nodes/PlotNode';
import ConversationNode from 'renderer/components/Nodes/ConversationNode';

import { getNodeRenderer } from 'renderer/services/plugins/NodeRegistry';

import 'reactflow/dist/style.css';

const edgeSharedSettings = {
  markerEnd: { type: MarkerType.ArrowClosed, width: 6 },
};

const ReactFlowStyled = styled(ReactFlow)`
  background-color: ${({ theme }) => theme.palette.background.default};
  .react-flow__edge-path {
    stroke: ${({ theme }) => theme.palette.text.primary};
    stroke-width: 6px;
  }
`;

// const MiniMapStyled = styled(MiniMap)`
//   background-color: ${({ theme }) => theme.palette.background.default};

//   .react-flow__minimap-mask {
//     fill: ${({ theme }) => theme.palette.background.paper};
//   }

//   .react-flow__minimap-node {
//     fill: ${({ theme }) => theme.palette.background.paper};
//     stroke: ${({ theme }) => theme.palette.primary.main};
//   }
// `;

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

type NodeDrawerOpenType = 'rclick' | 'extend' | 'edge';
type SetIsDirtyCallbackType = (isDirty: boolean) => void;

export interface FlowProps {
  tabId: string;
  setTabIsDirty: SetIsDirtyCallbackType;
  config: FlowViewConfig;
}

function Flow({ tabId, setTabIsDirty, config }: FlowProps) {
  const nodeConfigs = config.nodes;
  const dispatch = useAppDispatch();
  const tabState = useAppSelector((state) =>
    state.tabsState.tabs.find((tab) => tab.id === tabId)
  );

  const viewport = useViewport();

  const reactFlowRef = React.useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] =
    React.useState<ReactFlowInstance>();
  const [connectingNodeId, setConnectingId] = React.useState<string | null>();
  const previousTabIdRef = React.useRef<string>(tabId);

  const { undo, redo, takeSnapshot } = useUndoRedo({
    tabId,
    setIsDirty: setTabIsDirty,
    maxHistorySize: 100,
  });

  const [nodes, setNodes] = React.useState<Node[]>([]);
  const [edges, setEdges] = React.useState<Edge[]>([]);

  const onNodesChange = React.useCallback((changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = React.useCallback((changes: EdgeChange[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const [splash, setSplash] = React.useState<boolean>(true);
  const [contextMenu, setContextMenu] = React.useState<{
    x: number;
    y: number;
    type: NodeDrawerOpenType;
  } | null>(null);

  const nodeTypes = React.useMemo(() => {
    const base = {
      Plot: PlotNode,
      Conversation: ConversationNode,
    };

    const dynamic: { [key: string]: React.ComponentType<any> } = {};

    nodeConfigs.forEach((nodeConfig) => {
      if (!nodeConfig.renderer) return;
      const component = getNodeRenderer(nodeConfig.renderer);
      if (component) {
        dynamic[nodeConfig.type] = component;
      }
    });

    return { ...base, ...dynamic };
  }, [nodeConfigs]);

  const centerOnNode = useCenterOnNode();

  const onSave = React.useCallback(() => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      const json = JSON.stringify(flow);
      window.electron.ipcRenderer.invoke(
        ChannelsMain.fspWriteFile,
        tabState?.id,
        json
      );
    }
  }, [reactFlowInstance, tabState]);

  const onReactFlowInit = React.useCallback(
    (element: ReactFlowInstance) => {
      const { setViewport } = element;
      setReactFlowInstance(element);
      const restore = async () => {
        if (!tabState) return;

        // Try to load from flowState first, fall back to file content
        if (tabState.flowState) {
          const {
            nodes: flowNodes,
            edges: flowEdges,
            viewport: flowViewport,
          } = tabState.flowState;
          // Clone nodes to avoid mutating Redux state
          const clonedNodes =
            flowNodes?.map((node: any) => ({
              ...node,
              data: { ...node.data, focusOnInit: false },
            })) || [];
          setNodes(clonedNodes);
          setEdges(flowEdges || []);
          setViewport(flowViewport);
          setSplash(false);
        } else {
          const tabData = tabState.tabData as FileTabData;
          const flow = JSON.parse(tabData.content);

          if (flow) {
            const { x = 0, y = 0, zoom = 1 } = flow.viewport;
            flow.nodes?.forEach((node: any) => {
              node.data.focusOnInit = false;
            });
            setNodes(flow.nodes || []);
            setEdges(flow.edges || []);
            setViewport({ x, y, zoom });
            setSplash(false);
          }
        }
      };

      restore();
    },
    [setReactFlowInstance, setNodes, setEdges, tabState, setSplash]
  );

  // Save flow state to Redux when switching tabs
  React.useEffect(() => {
    const previousTabId = previousTabIdRef.current;

    // If tab changed and we have data to save
    if (previousTabId !== tabId && reactFlowInstance && nodes.length > 0) {
      const flowState: FlowState = {
        nodes,
        edges,
        viewport: reactFlowInstance.getViewport(),
      };

      dispatch(setFlowState({ id: previousTabId, flowState }));
    }

    // Load new tab's state
    if (previousTabId !== tabId && reactFlowInstance && tabState) {
      if (tabState.flowState) {
        const {
          nodes: flowNodes,
          edges: flowEdges,
          viewport: flowViewport,
        } = tabState.flowState;
        // Clone nodes to avoid mutating Redux state
        const clonedNodes =
          flowNodes?.map((node: any) => ({
            ...node,
            data: { ...node.data, focusOnInit: false },
          })) || [];
        setNodes(clonedNodes);
        setEdges(flowEdges || []);
        reactFlowInstance.setViewport(flowViewport);
        setSplash(false);
      } else {
        const tabData = tabState.tabData as FileTabData;
        const flow = JSON.parse(tabData.content);

        if (flow) {
          const { x = 0, y = 0, zoom = 1 } = flow.viewport;
          flow.nodes?.forEach((node: any) => {
            node.data.focusOnInit = false;
          });
          setNodes(flow.nodes || []);
          setEdges(flow.edges || []);
          reactFlowInstance.setViewport({ x, y, zoom });
          setSplash(false);
        }
      }
    }

    previousTabIdRef.current = tabId;
  }, [
    tabId,
    reactFlowInstance,
    nodes,
    edges,
    tabState,
    dispatch,
    setNodes,
    setEdges,
    setSplash,
  ]);

  const handleContextMenu = React.useCallback(
    (event: React.MouseEvent, type: NodeDrawerOpenType = 'rclick') => {
      event.preventDefault();
      setContextMenu(
        contextMenu === null
          ? {
              x: event.clientX,
              y: event.clientY,
              type,
            }
          : null
      );
    },
    [contextMenu]
  );

  const handleKeyPress = React.useCallback(
    (event: KeyboardEvent) => {
      if (
        event.code === 'KeyZ' &&
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey
      ) {
        redo();
      } else if (event.code === 'KeyZ' && (event.ctrlKey || event.metaKey)) {
        undo();
      } else if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
        const selectedNodes = nodes.filter((node) => node.selected);
        // if (selectedNodes.length === 0) return;
        if (selectedNodes.length > 1) return;
        const selected = selectedNodes.length === 0 ? null : selectedNodes[0];
        if (event.shiftKey) {
          const { x, y, zoom } = viewport;
          const { top, left, width, height } =
            reactFlowRef.current!.getBoundingClientRect();
          const transformedPos = selected
            ? rendererPointToPoint(selected.position, [x, y, zoom])
            : { x: width / 2, y: height / 2 };

          setContextMenu({
            x: left + transformedPos.x,
            y: top + transformedPos.y,
            type: 'extend',
          });
        } else if (selected) {
          const connections = nodeConfigs.find(
            (node) => node.type === selected.type
          )?.connections;
          const selectedNodeConnections = nodeConfigs.find(
            (node) => node.type === selected.type
          )?.connections;
          const newNode = {
            id: uuidv4(),
            type: selected.type,
            data: { label: 'node cusds', focusOnInit: true },
            position: { x: selected.position.x + 400, y: selected.position.y },
            selected: true,
          };
          selected.selected = false;
          takeSnapshot();
          setNodes((nds) => nds.concat(newNode));
          if (connections && selectedNodeConnections) {
            setEdges((eds) =>
              eds.concat({
                id: uuidv4(),
                source: selected.id,
                target: newNode.id,
                ...edgeSharedSettings,
              })
            );
          }
          centerOnNode(newNode.id);
        }
      } else if (event.code === 'KeyS' && (event.ctrlKey || event.metaKey)) {
        onSave();
      }
    },
    [
      nodeConfigs,
      nodes,
      setNodes,
      setEdges,
      viewport,
      takeSnapshot,
      undo,
      redo,
      onSave,
      centerOnNode,
    ]
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

  const onConnectStart = React.useCallback(
    (_: unknown, { nodeId }: { nodeId: string | null }) => {
      setConnectingId(nodeId);
    },
    []
  );

  const onConnectEnd = React.useCallback(
    (event: any) => {
      const targetIsPane = event.target.classList.contains('react-flow__pane');

      if (targetIsPane) {
        handleContextMenu(event, 'edge');
      }
    },
    [handleContextMenu]
  );

  const onNodeDragStart = React.useCallback(() => {
    takeSnapshot();
  }, [takeSnapshot]);

  const onSelectionDragStart = React.useCallback(() => {
    takeSnapshot();
  }, [takeSnapshot]);

  const onNodesDelete = React.useCallback(() => {
    takeSnapshot();
  }, [takeSnapshot]);

  const onEdgesDelete = React.useCallback(() => {
    takeSnapshot();
  }, [takeSnapshot]);

  const onNodeDrawerItemSelected = React.useCallback(
    (item: string) => {
      if (!contextMenu) return;
      const selectedNodes = nodes.filter((node) => node.selected);
      const prevNode = selectedNodes.length === 1 ? selectedNodes[0] : null;
      const connectionSource = prevNode?.id || connectingNodeId;
      const rclick = contextMenu.type === 'rclick';
      const connections = nodeConfigs.find(
        (node) => node.type === item
      )?.connections;
      const prevNodeConnections = nodeConfigs.find(
        (node) => node.type === prevNode?.type
      )?.connections;
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
      if (!rclick && prevNode) {
        position.x += 400;
      }
      const newNode = {
        id: uuidv4(),
        type: item,
        data: { label: 'node cusds', focusOnInit: !rclick },
        position,
        selected: true,
      };
      selectedNodes.forEach((node) => {
        node.selected = false;
      });
      takeSnapshot();
      setNodes((nds) => nds.concat(newNode));
      if (!rclick && connectionSource && connections && prevNodeConnections) {
        setEdges((eds) =>
          eds.concat({
            id: uuidv4(),
            source: connectionSource,
            target: newNode.id,
            ...edgeSharedSettings,
          })
        );
      }
      if (!rclick) centerOnNode(newNode.id);
    },
    [
      nodeConfigs,
      contextMenu,
      nodes,
      setNodes,
      setEdges,
      viewport,
      connectingNodeId,
      takeSnapshot,
      centerOnNode,
    ]
  );

  const items = React.useMemo(
    () => nodeConfigs.map((node) => node.type),
    [nodeConfigs]
  );

  return (
    <Box sx={{ position: 'relative', height: '100%', width: '100%' }}>
      <ReactFlowStyled
        ref={reactFlowRef}
        onInit={onReactFlowInit}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        onNodeDragStart={onNodeDragStart}
        onSelectionDragStart={onSelectionDragStart}
        onNodesDelete={onNodesDelete}
        onEdgesDelete={onEdgesDelete}
        nodeTypes={nodeTypes}
        proOptions={{ hideAttribution: true }}
        maxZoom={6}
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
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '100%',
          backgroundColor: (theme) => theme.palette.background.default,
          display: splash ? 'block' : 'none',
        }}
      />
    </Box>
  );
}

export interface FlowViewProps {
  tabId: string;
  setTabIsDirty: SetIsDirtyCallbackType;
  config: FlowViewConfig;
}

export default function FlowView({
  tabId,
  setTabIsDirty,
  config,
}: FlowViewProps) {
  return (
    <ReactFlowProvider>
      <Flow tabId={tabId} setTabIsDirty={setTabIsDirty} config={config} />
    </ReactFlowProvider>
  );
}
