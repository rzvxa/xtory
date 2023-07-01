import { TabType } from './tabType';
import { FileTabData } from './fileTabData';

export interface TabState {
  id: string;
  title: string;
  tabType: TabType;
  tabData: string | FileTabData;
}
