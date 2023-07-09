import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  TabType,
  TabState,
  TabsState,
  HistoryItem,
  FileTabData,
} from '../types/tabs';

import { XTORY_TABS_STATE } from './constants';

type TabId = string;

// fake data generator
const getItems = (count: any): TabState[] =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `tab-${k}`,
    title: `Conversation-${k}.xconv`,
    tabType: TabType.instance,
    isDirty: false,
    tabData: 'extra',
  }));

export const initialState: TabsState = {
  activeTabId: 'tab-0',
  tabs: getItems(6),
};

function setStateReducer<Type>() {
  return (state: Type, { payload }: PayloadAction<TabId>) => {
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
      { payload }: PayloadAction<TabId | null>
    ) => {
      state.activeTabId = payload;
      // TODO save current(state) over here!
    },
    setTabs: (state: TabsState, { payload }: PayloadAction<TabState[]>) => {
      state.tabs = payload;
      // TODO save current(state) over here!
    },
    addTab: (state: TabsState, { payload }: PayloadAction<TabState>) => {
      if (state.tabs.find((tab) => tab.id === payload.id)) {
        return;
      }
      state.tabs.push(payload);
    },
    removeTab: (state: TabsState, { payload }: PayloadAction<TabId>) => {
      state.tabs = state.tabs.filter((tab) => tab.id !== payload);
    },
    setTabData: (
      state: TabsState,
      { payload }: PayloadAction<{ id: TabId; tabData: any }>
    ) => {
      const tabIndex = state.tabs.findIndex(
        (tab: TabState) => tab.id === payload.id
      );
      state.tabs[tabIndex].tabData = payload.tabData;
    },
    pushHistorySnapshot: (
      state: TabsState,
      {
        payload,
      }: PayloadAction<{
        id: TabId;
        snapshot: HistoryItem;
        maxHistorySize: number;
      }>
    ) => {
      console.log('snapshot');
      const tabIndex = state.tabs.findIndex((tab) => tab.id === payload.id)!;
      const tabState = state.tabs[tabIndex];
      const { history } = tabState.tabData as FileTabData;
      const { past } = history;

      history.past = [
        ...past.slice(past.length - payload.maxHistorySize + 1, past.length),
        payload.snapshot,
      ];
      history.future = [];

      history.now = payload.snapshot;
    },
    setPastHistory: (
      state: TabsState,
      { payload }: PayloadAction<{ id: TabId; history: HistoryItem[] }>
    ) => {
      const tabState = state.tabs.find((tab) => tab.id === payload.id)!;
      const { history } = tabState.tabData as FileTabData;

      history.past = payload.history;
    },
    setFutureHistory: (
      state: TabsState,
      { payload }: PayloadAction<{ id: TabId; history: HistoryItem[] }>
    ) => {
      const tabState = state.tabs.find((tab) => tab.id === payload.id)!;
      const { history } = tabState.tabData as FileTabData;

      history.future = payload.history;
    },
    setTabIsDirty: (
      state: TabsState,
      { payload }: PayloadAction<{ id: TabId; isDirty: boolean }>
    ) => {
      const tabIndex = state.tabs.findIndex(
        (tab: TabState) => tab.id === payload.id
      );
      state.tabs[tabIndex].isDirty = payload.isDirty;
    },
    setState: setStateReducer<TabsState>(),
  },
});

export const {
  setActiveTabId,
  setTabs,
  addTab,
  removeTab,
  setTabData,
  pushHistorySnapshot,
  setPastHistory,
  setFutureHistory,
  setTabIsDirty,
  setState,
} = tabs.actions;
export default tabs.reducer;
