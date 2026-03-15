/// <reference types="@xtory/plugin-api/renderer" />
/// <reference types="react" />

const {
  modules: { ReactFlow },
  ui: { Button, TextArea, NodeContainer },
  hooks: { useResourceDrawer },
  registerNodeRenderer,
} = window.renderer;

const { Handle, Position, useReactFlow } = ReactFlow;

interface ImageNodeData {
  src?: string;
  alt?: string;
}

function ImageNode({ data, id }: Renderer.NodeProps<ImageNodeData>) {
  const { src, alt } = data || {};
  const [imageSrc, setImageSrc] = React.useState(src);
  const [imageAlt, setImageAlt] = React.useState(alt || '');
  const { openResourceDrawer } = useResourceDrawer();
  const { setNodes } = useReactFlow();

  React.useEffect(() => {
    if (src !== imageSrc) {
      setImageSrc(src);
    }
  }, [src, imageSrc]);

  React.useEffect(() => {
    if (alt !== imageAlt) {
      setImageAlt(alt || '');
    }
  }, [alt, imageAlt]);

  const handleSelectImage = React.useCallback(
    (uuid: string) => {
      const resourceUrl = `resource://${uuid}`;
      setImageSrc(resourceUrl);

      setNodes((nds: any[]) =>
        nds.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, src: resourceUrl } }
            : node
        )
      );
    },
    [id, setNodes]
  );

  const handleOpenDrawer = React.useCallback(() => {
    openResourceDrawer({
      filterType: 'image',
      onSelect: handleSelectImage,
    });
  }, [openResourceDrawer, handleSelectImage]);

  return (
    <NodeContainer title="Image" selected={false}>
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={imageAlt || 'reference'}
          style={{
            maxWidth: '100%',
            display: 'block',
            borderRadius: 4,
            marginBottom: 8,
          }}
        />
      ) : (
        <div
          style={{
            fontSize: 12,
            opacity: 0.7,
            marginBottom: 8,
            textAlign: 'center',
          }}
        >
          No image selected
        </div>
      )}

      <Button
        variant="outlined"
        size="small"
        onClick={handleOpenDrawer}
        fullWidth
      >
        {imageSrc ? 'Change Image' : 'Select Image'}
      </Button>

      {imageAlt && (
        <div style={{ marginTop: 8, fontSize: 11, opacity: 0.8 }}>
          {imageAlt}
        </div>
      )}

      <Handle type="source" position={Position.Right} />
    </NodeContainer>
  );
}

interface NoteNodeData {
  text?: string;
}

interface NoteNodeProps {
  id: string;
  data: NoteNodeData;
  selected: boolean;
}

function NoteNode({ id, data, selected }: NoteNodeProps) {
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
    <NodeContainer title="Note" selected={selected}>
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
}

registerNodeRenderer('reference-nodes/ImageNode', ImageNode);
registerNodeRenderer('reference-nodes/NoteNode', NoteNode);
