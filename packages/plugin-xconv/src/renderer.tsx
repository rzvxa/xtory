/// <reference types="@xtory/plugin-api/renderer" />

import type { Conversation } from './types';

const {
  modules: {
    ReactFlow: { Handle, Position, useReactFlow },
  },
  ui: {
    icons: { OpenInBrowser },
    TextField,
    NodeContainer,
    Autocomplete,
    Chip,
    Box,
    Dialog,
    IconButton,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
  },
  registerNodeRenderer,
} = window.renderer;

const { useState, useEffect } = React;

interface StartConversationData {
  name?: string;
  description?: string;
  characterIds?: string[];
}

interface TextNodeData {
  text?: string;
}

interface ChoiceNodeData {
  text?: string;
}

interface SetNodeData {
  variableKey?: string;
  value?: string;
}

interface BranchNodeData {
  variableKey?: string;
}

interface FunctionNodeData {
  functionName?: string;
}

interface ConversationNodeData {
  conversationId?: string;
}

function StartConversationNode({
  id,
  data,
  selected,
}: Renderer.NodeProps<StartConversationData>) {
  const { setNodes } = useReactFlow();
  const [allCharacters, setAllCharacters] = useState<any>({});

  useEffect(() => {
    // Fetch all characters
    window.electron.ipcRenderer
      .invoke('serviceCall', 'characters', 'getAllCharacters')
      .then((chars: any) => setAllCharacters(chars || {}))
      .catch((err: any) =>
        window.renderer.logger.error(`Failed to fetch characters: ${err}`, [
          'StartConversationNode',
        ])
      );
  }, []);

  const characterList = Object.values(allCharacters);
  const selectedCharacters = (data.characterIds || [])
    .map((id) => allCharacters[id])
    .filter(Boolean);

  const handleAddCharacter = (character: any) => {
    if (!character || !data.characterIds) {
      setNodes((nds: any[]) =>
        nds.map((node) =>
          node.id === id
            ? {
                ...node,
                data: {
                  ...node.data,
                  characterIds: character ? [character.id] : [],
                },
              }
            : node
        )
      );
      return;
    }

    if (!data.characterIds.includes(character.id)) {
      setNodes((nds: any[]) =>
        nds.map((node) =>
          node.id === id
            ? {
                ...node,
                data: {
                  ...node.data,
                  characterIds: [...data.characterIds!, character.id],
                },
              }
            : node
        )
      );
    }
  };

  const handleRemoveCharacter = (characterId: string) => {
    setNodes((nds: any[]) =>
      nds.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                characterIds: (data.characterIds || []).filter(
                  (id) => id !== characterId
                ),
              },
            }
          : node
      )
    );
  };

  return (
    <NodeContainer
      title={`Start: ${data.name || 'Untitled'}`}
      selected={selected}
    >
      <Handle type="source" position={Position.Right} />

      <TextField
        size="small"
        placeholder="Conversation name"
        value={data.name || ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setNodes((nds: any[]) =>
            nds.map((node) =>
              node.id === id
                ? { ...node, data: { ...node.data, name: e.target.value } }
                : node
            )
          )
        }
        sx={{ width: '100%', mb: 1 }}
      />

      <TextField
        size="small"
        multiline
        minRows={2}
        placeholder="Description"
        value={data.description || ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setNodes((nds: any[]) =>
            nds.map((node) =>
              node.id === id
                ? {
                    ...node,
                    data: { ...node.data, description: e.target.value },
                  }
                : node
            )
          )
        }
        sx={{ width: '100%', mb: 1 }}
      />

      {/* Character Picker */}
      <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 4 }}>
        Characters:
      </div>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 0.5,
          mb: 1,
          minHeight: 24,
        }}
      >
        {selectedCharacters.map((char: any) => (
          <Chip
            key={char.id}
            label={char.name}
            size="small"
            onDelete={() => handleRemoveCharacter(char.id)}
          />
        ))}
      </Box>

      <Autocomplete
        options={characterList}
        getOptionLabel={(option: any) => option?.name || ''}
        value={null}
        onChange={(_: any, newValue: any) => {
          if (newValue) {
            handleAddCharacter(newValue);
          }
        }}
        renderInput={(params: any) => (
          // eslint-disable-next-line react/jsx-props-no-spreading
          <TextField {...params} placeholder="Add character..." size="small" />
        )}
        sx={{ width: '100%' }}
      />
    </NodeContainer>
  );
}

function TextNode({ id, data, selected }: Renderer.NodeProps<TextNodeData>) {
  const { setNodes } = useReactFlow();

  return (
    <NodeContainer title="Text" selected={selected}>
      <Handle type="target" position={Position.Left} />
      <TextField
        size="small"
        multiline
        minRows={5}
        placeholder="Dialogue text..."
        value={data.text || ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setNodes((nds: any[]) =>
            nds.map((node) =>
              node.id === id
                ? { ...node, data: { ...node.data, text: e.target.value } }
                : node
            )
          )
        }
        sx={{ width: '100%' }}
      />
      <Handle type="source" position={Position.Right} />
    </NodeContainer>
  );
}

function ChoiceNode({
  id,
  data,
  selected,
}: Renderer.NodeProps<ChoiceNodeData>) {
  const { setNodes } = useReactFlow();

  return (
    <NodeContainer title="Choice" selected={selected}>
      <Handle type="target" position={Position.Left} />
      <TextField
        size="small"
        placeholder="Choice text..."
        value={data.text || ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setNodes((nds: any[]) =>
            nds.map((node) =>
              node.id === id
                ? { ...node, data: { ...node.data, text: e.target.value } }
                : node
            )
          )
        }
        sx={{ width: '100%' }}
      />
      <Handle type="source" position={Position.Right} />
    </NodeContainer>
  );
}

function SetNode({ id, data, selected }: Renderer.NodeProps<SetNodeData>) {
  const { setNodes } = useReactFlow();

  return (
    <NodeContainer title="Set Variable" selected={selected}>
      <Handle type="target" position={Position.Left} />
      <TextField
        size="small"
        placeholder="Variable key"
        value={data.variableKey || ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setNodes((nds: any[]) =>
            nds.map((node) =>
              node.id === id
                ? {
                    ...node,
                    data: { ...node.data, variableKey: e.target.value },
                  }
                : node
            )
          )
        }
        sx={{ width: '100%', mb: 1 }}
      />
      <TextField
        size="small"
        placeholder="Value"
        value={data.value || ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setNodes((nds: any[]) =>
            nds.map((node) =>
              node.id === id
                ? { ...node, data: { ...node.data, value: e.target.value } }
                : node
            )
          )
        }
        sx={{ width: '100%' }}
      />
      <Handle type="source" position={Position.Right} />
    </NodeContainer>
  );
}

function BranchNode({
  id,
  data,
  selected,
}: Renderer.NodeProps<BranchNodeData>) {
  const { setNodes } = useReactFlow();

  return (
    <NodeContainer title="Branch" selected={selected}>
      <Handle type="target" position={Position.Left} />
      <TextField
        size="small"
        placeholder="Variable to check"
        value={data.variableKey || ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setNodes((nds: any[]) =>
            nds.map((node) =>
              node.id === id
                ? {
                    ...node,
                    data: { ...node.data, variableKey: e.target.value },
                  }
                : node
            )
          )
        }
        sx={{ width: '100%' }}
      />
      <Handle type="source" position={Position.Right} id="default" />
    </NodeContainer>
  );
}

function RandomNode({ selected }: Renderer.NodeProps) {
  return (
    <NodeContainer title="Random" selected={selected}>
      <Handle type="target" position={Position.Left} />
      <div style={{ fontSize: 12, opacity: 0.7 }}>Randomly chooses output</div>
      <Handle type="source" position={Position.Right} />
    </NodeContainer>
  );
}

function FunctionNode({
  id,
  data,
  selected,
}: Renderer.NodeProps<FunctionNodeData>) {
  const { setNodes } = useReactFlow();

  return (
    <NodeContainer title="Function" selected={selected}>
      <Handle type="target" position={Position.Left} />
      <TextField
        size="small"
        placeholder="Function name"
        value={data.functionName || ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setNodes((nds: any[]) =>
            nds.map((node) =>
              node.id === id
                ? {
                    ...node,
                    data: { ...node.data, functionName: e.target.value },
                  }
                : node
            )
          )
        }
        sx={{ width: '100%' }}
      />
      <Handle type="source" position={Position.Right} />
    </NodeContainer>
  );
}

function EndConversationNode({ selected }: Renderer.NodeProps) {
  return (
    <NodeContainer title="End" selected={selected}>
      <Handle type="target" position={Position.Left} />
      <div style={{ fontSize: 12, opacity: 0.7 }}>Conversation ends</div>
    </NodeContainer>
  );
}

/**
 * Conversation node for the xflow filetype
 */
function ConversationNode({
  id,
  data,
  selected,
}: Renderer.NodeProps<ConversationNodeData>) {
  const { setNodes } = useReactFlow();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newConvName, setNewConvName] = useState('');
  const [newConvDescription, setNewConvDescription] = useState('');

  const loadConversations = () => {
    window.electron.ipcRenderer
      .invoke('serviceCall', 'conversations', 'getIndex')
      .then((index: any[]) => {
        setConversations(index || []);
        window.renderer.logger.info(
          // eslint-disable-next-line promise/always-return
          `Loaded ${(index || []).length} conversations`,
          ['ConversationNode']
        );
      })
      .catch((err: any) =>
        window.renderer.logger.error(`Failed to fetch conversations: ${err}`, [
          'ConversationNode',
        ])
      );
  };

  useEffect(() => {
    loadConversations();
  }, []);

  const selectedConversation = conversations.find(
    (conv) => conv.id === data.conversationId
  );

  const handleOpenCreateDialog = () => {
    setNewConvName('');
    setNewConvDescription('');
    setCreateDialogOpen(true);
  };

  const handleCreateNew = async () => {
    if (!newConvName.trim()) return;

    try {
      const newConv = await window.electron.ipcRenderer.invoke(
        'serviceCall',
        'conversations',
        'createConversation',
        [
          'conversations',
          newConvName.trim(),
          newConvDescription.trim(),
          [], // characterIds
        ]
      );

      // Update node data with new conversation ID
      setNodes((nds: any[]) =>
        nds.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, conversationId: newConv.id } }
            : node
        )
      );

      // Refresh conversation list
      loadConversations();

      // TODO: fix this path, it is wrong after recent refactors
      // Open the new conversation file
      const fileName = `${newConvName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')}.xconv`;
      const relativePath = `conversations/${fileName}`;
      window.electron.ipcRenderer.sendMessage('openFileAsTab', relativePath);

      setCreateDialogOpen(false);
      window.renderer.logger.info(`Created conversation: ${newConvName}`, [
        'ConversationNode',
      ]);
    } catch (err: any) {
      window.renderer.logger.error(`Failed to create conversation: ${err}`, [
        'ConversationNode',
      ]);
    }
  };

  // Create options with "Create New..." at the top
  const CREATE_NEW_OPTION = {
    id: '__create_new__',
    name: '+ Create New Conversation...',
    filePath: '',
  };
  const options = [CREATE_NEW_OPTION, ...conversations];
  console.log('selected is: ', selectedConversation);

  return (
    <>
      <NodeContainer title="Conversation" selected={selected}>
        <Handle type="target" position={Position.Left} />

        {selectedConversation && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 2,
              alignItems: 'center',
            }}
          >
            <div style={{ fontSize: 11, opacity: 0.7 }}>
              {selectedConversation.filePath}
            </div>
            <IconButton
              sx={{ ml: 'auto' }}
              onClick={() =>
                window.electron.ipcRenderer.sendMessage(
                  'openFileAsTab',
                  selectedConversation.filePath
                )
              }
            >
              <OpenInBrowser />
            </IconButton>
          </div>
        )}

        <Autocomplete
          options={options}
          getOptionLabel={(option: any) => option?.name || ''}
          value={selectedConversation || null}
          onChange={(_: any, newValue: any) => {
            if (!newValue) {
              // Cleared selection
              setNodes((nds: any[]) =>
                nds.map((node) =>
                  node.id === id
                    ? { ...node, data: { ...node.data, conversationId: '' } }
                    : node
                )
              );
            } else if (newValue.id === '__create_new__') {
              // Open create dialog
              handleOpenCreateDialog();
            } else {
              // Selected existing conversation
              setNodes((nds: any[]) =>
                nds.map((node) =>
                  node.id === id
                    ? {
                        ...node,
                        data: { ...node.data, conversationId: newValue.id },
                      }
                    : node
                )
              );
            }
          }}
          filterOptions={(options: any[], state: any) => {
            const inputValue = state.inputValue.toLowerCase();
            if (!inputValue) return options;

            // Always show "Create New..." option and filter conversations by name or path
            return options.filter(
              (option: any) =>
                option.id === '__create_new__' ||
                option.name.toLowerCase().includes(inputValue) ||
                option.filePath?.toLowerCase().includes(inputValue)
            );
          }}
          renderOption={(props: any, option: any) => (
            <li
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...props}
              style={
                option.id === '__create_new__'
                  ? { fontWeight: 'bold', borderBottom: '1px solid #444' }
                  : {}
              }
            >
              {option.id === '__create_new__' ? (
                option.name
              ) : (
                <div>
                  <div>{option.name}</div>
                  <div style={{ fontSize: 10, opacity: 0.6 }}>
                    {option.filePath}
                  </div>
                </div>
              )}
            </li>
          )}
          renderInput={(params: any) => (
            <TextField
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...params}
              placeholder="Select or search conversation..."
              size="small"
            />
          )}
          sx={{ width: '100%' }}
        />

        <Handle type="source" position={Position.Right} />
      </NodeContainer>

      {/* Create New Conversation Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
      >
        <DialogTitle>Create New Conversation</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              pt: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              minWidth: 300,
            }}
          >
            <TextField
              autoFocus
              label="Name"
              value={newConvName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewConvName(e.target.value)
              }
              fullWidth
              size="small"
            />
            <TextField
              label="Description"
              value={newConvDescription}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewConvDescription(e.target.value)
              }
              fullWidth
              multiline
              rows={3}
              size="small"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreateNew}
            variant="contained"
            disabled={!newConvName.trim()}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

// Register all node renderers
registerNodeRenderer('xconv/StartConversationNode', StartConversationNode);
registerNodeRenderer('xconv/TextNode', TextNode);
registerNodeRenderer('xconv/ChoiceNode', ChoiceNode);
registerNodeRenderer('xconv/SetNode', SetNode);
registerNodeRenderer('xconv/BranchNode', BranchNode);
registerNodeRenderer('xconv/RandomNode', RandomNode);
registerNodeRenderer('xconv/FunctionNode', FunctionNode);
registerNodeRenderer('xconv/EndConversationNode', EndConversationNode);
registerNodeRenderer('xconv/ConversationNode', ConversationNode);
