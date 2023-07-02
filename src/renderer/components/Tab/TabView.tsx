import React from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import { useAppDispatch } from 'renderer/state/store/index';

import { changeTab } from 'renderer/state/store/tabs';
import {
  TabState,
  TabType,
  FileTabData,
} from 'renderer/state/types/tabs/index';

import DefaultFileView from './TabViews/DefaultFileView';
import FlowView from './TabViews/FlowView';

export interface TabViewProps {
  tabId: string;
  state: TabState;
}

export default function TabView({ tabId, state }: TabViewProps) {
  const dispatch = useAppDispatch();
  const tabData = state.tabData as FileTabData;
  const dispatchFileView = () => {
    if (tabData.extension === 'xtory') {
      return <FlowView />;
    }
    return <DefaultFileView tabData={tabData} />;
  };

  return (
    <Box sx={{ height: 'calc(100vh - 52px)', overflow: 'hidden' }}>
      {state.tabType === TabType.file ? (
        dispatchFileView()
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
          value={tabData}
        />
      )}
    </Box>
  );
}
