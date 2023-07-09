import { Edge, Node } from 'reactflow';

export interface HistoryItem {
  id: string;
  nodes: Node[];
  edges: Edge[];
}
