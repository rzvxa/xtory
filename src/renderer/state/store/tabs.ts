import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { TabState, TabsState } from '../types/tabs/index';

import { XTORY_TABS_STATE } from './constants';

// fake data generator
const getItems = (count: any): TabState[] =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `tab-${k}`,
    title: `Conversation-${k}.xconv`,
    extra: 'extra',
  }));

export const initialState: TabsState = {
  activeTabId: 'tab-0',
  tabs: getItems(6),
};

function setStateReducer<Type>() {
  return (state: Type, { payload }: PayloadAction<string>) => {
    // TODO
    console.log('handle loading state from drive here', state, payload);
  };
}

const tabs: any = createSlice({
  initialState,
  name: XTORY_TABS_STATE,
  reducers: {
    setActiveTabId: (
      state: TabsState,
      { payload }: PayloadAction<string | null>
    ) => {
      state.activeTabId = payload;
      // TODO save current(state) over here!
    },
    setTabs: (state: TabsState, { payload }: PayloadAction<TabState[]>) => {
      state.tabs = payload;
      // TODO save current(state) over here!
    },
    changeTab: (
      state: TabsState,
      { payload }: PayloadAction<{ id: string; extra: string }>
    ) => {
      const tabIndex = state.tabs.findIndex(
        (tab: TabState) => tab.id === payload.id
      );
      state.tabs[tabIndex].extra = payload.extra;
    },
    setState: setStateReducer<TabsState>(),
  },
});

export const { setActiveTabId, setTabs, changeTab, setState } = tabs.actions;
export default tabs.reducer;
