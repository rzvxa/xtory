/// <reference types="@xtory/plugin-api" />
/// <reference types="react" />

// React is available globally via window.React from the main app

const {
  modules: { ReactFlow },
  hooks: { useResourceDrawer },
  registerNodeRenderer,
} = window.renderer;

const { Handle, Position, useReactFlow } = ReactFlow;

interface ImageNodeData {
  src?: string;
  alt?: string;
}

interface ImageNodeProps {
  data: ImageNodeData;
  id: string;
}

function ImageNode({ data, id }: ImageNodeProps) {
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
    <div
      style={{
        borderRadius: 8,
        border: '2px solid #888',
        padding: 8,
        background: '#222',
        color: '#eee',
        minWidth: 200,
        maxWidth: 300,
      }}
    >
      <Handle type="target" position={Position.Left} />

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

      <button
        type="button"
        onClick={handleOpenDrawer}
        style={{
          width: '100%',
          padding: '6px 12px',
          background: '#444',
          border: '1px solid #666',
          borderRadius: 4,
          color: '#eee',
          cursor: 'pointer',
          fontSize: 12,
        }}
      >
        {imageSrc ? 'Change Image' : 'Select Image'}
      </button>

      {imageAlt && (
        <div style={{ marginTop: 8, fontSize: 11, opacity: 0.8 }}>
          {imageAlt}
        </div>
      )}

      <Handle type="source" position={Position.Right} />
    </div>
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
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (data.text !== text) {
      setText(data.text || '');
    }
  }, [data.text, text]);

  React.useEffect(() => {
    if (selected && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [selected]);

  const handleTextChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
    <div
      style={{
        borderRadius: 8,
        border: selected ? '2px solid #1976d2' : '2px solid #888',
        padding: 12,
        background: '#fffde7',
        minWidth: 200,
        maxWidth: 400,
      }}
    >
      <Handle type="target" position={Position.Left} />

      <div
        style={{
          fontWeight: 'bold',
          marginBottom: 8,
          color: '#333',
        }}
      >
        Note
      </div>

      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleTextChange}
        placeholder="Enter your note..."
        style={{
          width: '100%',
          minHeight: 100,
          padding: 8,
          border: '1px solid #ddd',
          borderRadius: 4,
          background: '#fff',
          resize: 'vertical',
          fontFamily: 'inherit',
          fontSize: 14,
        }}
      />

      <Handle type="source" position={Position.Right} />
    </div>
  );
}

registerNodeRenderer('reference-nodes/ImageNode', ImageNode);
registerNodeRenderer('reference-nodes/NoteNode', NoteNode);
