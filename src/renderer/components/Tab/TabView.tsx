import React from 'react';
import TextField from '@mui/material/TextField';

import { useAppDispatch } from 'renderer/state/store/index';

import { changeTab } from 'renderer/state/store/tabs';
import { TabState, TabType } from 'renderer/state/types/tabs/index';

import FlowView from './TabViews/FlowView';

export interface TabViewProps {
  tabId: string;
  state: TabState;
}

export default function TabView({ tabId, state }: TabViewProps) {
  const dispatch = useAppDispatch();
  return (
    <div>
      {state.tabType === TabType.file ? (
        <FlowView />
      ) : (
        <TextField
          id="standard-basic"
          label="Standard"
          variant="standard"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            dispatch(
              changeTab({ id: tabId, tabData: { extra: e.target.value } })
            );
          }}
          value={state.tabData}
        />
      )}
    </div>
  );
}
