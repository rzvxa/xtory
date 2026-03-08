/// <reference types="@xtory/plugin-api/renderer" />
/// <reference types="react" />

const {
  modules: {
    ReactFlow: { Handle, Position, useReactFlow },
  },
  ui: { NodeContainer, TextArea },
  registerNodeRenderer,
} = window.renderer;

interface PlotNodeData {
  text?: string;
}

interface PlotNodeProps extends Renderer.NodeProps {
  id: string;
  data: PlotNodeData;
  selected: boolean;
}

const PlotNode = React.memo(({ id, data, selected }: PlotNodeProps) => {
  const [text, setText] = React.useState(data.text || '');
  const { setNodes } = useReactFlow();

  React.useEffect(() => {
    if (data.text !== text) {
      setText(data.text || '');
    }
  }, [data.text, text]);

  const handleTextChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newText = e.target.value;
      setText(newText);

      setNodes((nds: any[]) =>
        nds.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, text: newText } }
            : node
        )
      );
    },
    [id, setNodes]
  );

  return (
    <NodeContainer title="Plot" selected={selected}>
      <Handle type="target" position={Position.Left} />
      <TextArea
        variant="outlined"
        multiline
        minRows="5"
        value={text}
        onChange={handleTextChange}
        placeholder="Enter your note..."
      />
      <Handle type="source" position={Position.Right} />
    </NodeContainer>
  );
});

registerNodeRenderer('xflow/PlotNode', PlotNode);
