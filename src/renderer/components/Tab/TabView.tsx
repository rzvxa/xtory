import React from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import { useAppSelector, useAppDispatch } from 'renderer/state/store/index';
import {
  setTabData,
  setTabIsDirty as setTabIsDirtyReducer,
} from 'renderer/state/store/tabs';

import { TabType, FileTabData } from 'renderer/state/types/tabs/index';

import DefaultFileView from './TabViews/DefaultFileView';
import FlowView from './TabViews/FlowView';

export interface TabViewProps {
  tabId: string;
}

export default function TabView({ tabId }: TabViewProps) {
  const dispatch = useAppDispatch();

  const tabState = useAppSelector(
    (state) => state.tabsState.tabs.find((tab) => tab.id === tabId)!
  );
  const tabData = tabState.tabData as FileTabData;
  const setTabIsDirty = React.useCallback(
    (isDirty: boolean) => {
      dispatch(setTabIsDirtyReducer({ id: tabId, isDirty }));
    },
    [dispatch, tabId]
  );
  const dispatchFileView = () => {
    if (tabData.extension === 'xflow') {
      return <FlowView tabId={tabId} setTabIsDirty={setTabIsDirty} />;
    }
    return <DefaultFileView tabData={tabData} />;
  };

  return (
    <Box sx={{ height: 'calc(100vh - 52px)', overflow: 'hidden' }}>
      {tabState.tabType === TabType.file ? (
        dispatchFileView()
      ) : (
        <TextField
          id="standard-basic"
          label="Standard"
          variant="standard"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            dispatch(
              setTabData({ id: tabId, tabData: { extra: e.target.value } })
            );
          }}
          value={tabData}
        />
      )}
    </Box>
  );
}
