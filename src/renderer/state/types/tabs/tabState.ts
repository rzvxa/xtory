import { TabType } from './tabType';

export interface TabState {
  id: string;
  title: string;
  tabType: TabType;
  tabData: any;
}
