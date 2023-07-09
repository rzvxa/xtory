import { TabState } from './tabState';

export interface TabsState {
  activeTabId: string | null;
  tabs: TabState[];
}
