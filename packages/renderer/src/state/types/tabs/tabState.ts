import type { Edge, Node } from 'reactflow';

import { TabType } from './tabType';
import { FileTabData } from './fileTabData';

export interface FlowState {
  nodes: Node[];
  edges: Edge[];
  viewport: { x: number; y: number; zoom: number };
}

export interface TabState {
  id: string;
  title: string;
  tabType: TabType;
  isDirty: boolean;
  tabData: string | FileTabData;
  flowState?: FlowState;
}
