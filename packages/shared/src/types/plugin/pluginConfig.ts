import type { NodeInfo } from '@xtory/plugin-api';

export type FileViewType = 'flow' | 'simple-text';

export interface BaseFileViewConfig {
  fileType: string;
  viewType: FileViewType | (string & {});
  menuItems: { title: string; data: string }[];
  /** If true, only register if fileType already exists */
  optional?: boolean;
}

export interface FlowViewConfig extends BaseFileViewConfig {
  viewType: 'flow';
  nodes: NodeInfo[];
}

export interface SimpleTextViewConfig extends BaseFileViewConfig {
  viewType: 'simple-text';
}

export type FileViewConfig = FlowViewConfig | SimpleTextViewConfig;

export interface PluginConfig {
  fileViews: FileViewConfig[];
  /** Plugin dependencies */
  dependencies?: string[];
}
