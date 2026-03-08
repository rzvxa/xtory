export type ConversationNodeType =
  | 'StartConversation'
  | 'Text'
  | 'Choice'
  | 'Set'
  | 'Branch'
  | 'Random'
  | 'Function'
  | 'EndConversation';

export interface ConversationNodeBase {
  id: string;
  type: ConversationNodeType;
  position: { x: number; y: number };
  data: Record<string, any>;
}

export interface StartConversationNodeData {
  name: string;
  description: string;
  characterIds: string[];
  conditions?: Record<string, any>; // Variable-based starting conditions
}

export interface StartConversationNode extends ConversationNodeBase {
  type: 'StartConversation';
  data: StartConversationNodeData;
}

export interface TextNodeData {
  speakerId?: string; // Character ID
  text: string;
}

export interface TextNode extends ConversationNodeBase {
  type: 'Text';
  data: TextNodeData;
}

export interface ChoiceNodeData {
  text: string;
}

export interface ChoiceNode extends ConversationNodeBase {
  type: 'Choice';
  data: ChoiceNodeData;
}

export interface SetNodeData {
  variableKey: string;
  value: string | number | boolean;
}

export interface SetNode extends ConversationNodeBase {
  type: 'Set';
  data: SetNodeData;
}

export interface BranchCase {
  value: string | number | boolean;
  handle: string; // Output handle ID
}

export interface BranchNodeData {
  variableKey: string;
  cases: BranchCase[];
  defaultHandle?: string; // Optional default case
}

export interface BranchNode extends ConversationNodeBase {
  type: 'Branch';
  data: BranchNodeData;
}

export interface RandomNodeData {
  // No specific data, just randomizes between outputs
}

export interface RandomNode extends ConversationNodeBase {
  type: 'Random';
  data: RandomNodeData;
}

export interface FunctionNodeData {
  functionName: string;
  parameters?: Record<string, any>;
}

export interface FunctionNode extends ConversationNodeBase {
  type: 'Function';
  data: FunctionNodeData;
}

export interface EndConversationNodeData {
  // No specific data
}

export interface EndConversationNode extends ConversationNodeBase {
  type: 'EndConversation';
  data: EndConversationNodeData;
}

export type ConversationNode =
  | StartConversationNode
  | TextNode
  | ChoiceNode
  | SetNode
  | BranchNode
  | RandomNode
  | FunctionNode
  | EndConversationNode;

export interface ConversationEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface Conversation {
  id: string; // UUID v4
  name: string;
  description: string;
  characterIds: string[];
  filePath?: string;
  nodes: ConversationNode[];
  edges: ConversationEdge[];
  viewport?: { x: number; y: number; zoom: number };
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

export type ConversationMap = Record<string, Conversation>;

export interface ConversationIndex {
  id: string;
  name: string;
  description: string;
  characterIds: string[];
  filePath: string; // Relative to project root
}
