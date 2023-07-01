import { TabType } from './tabType';

export interface FileTabData {
  path: string;
  name: string;
  extension: string;
  content: string;
}

export interface TabState {
  id: string;
  title: string;
  tabType: TabType;
  tabData: string | FileTabData;
}
