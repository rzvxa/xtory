import React from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import { ChannelsMain, FileTypeMap } from 'shared/types';

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
  // TODO use shard type for the state
  const [fileTypes, setFileTypes] = React.useState<FileTypeMap | null>(null);

  React.useEffect(() => {
    async function getFileTypes() {
      const result: FileTypeMap = await window.electron.ipcRenderer.invoke(
        ChannelsMain.getFileTypes
      );
      setFileTypes(result);
    }
    getFileTypes().catch((e) => console.log('eee', e));
  }, []);

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
    if (fileTypes) {
      const fileTypePlugin = fileTypes[tabData.extension];
      if (fileTypePlugin) {
        return (
          <FlowView
            tabId={tabId}
            setTabIsDirty={setTabIsDirty}
            config={fileTypePlugin.flowView}
          />
        );
      } else {
        return <DefaultFileView tabData={tabData} />;
      }
    } else {
      return undefined;
    }
  };

  return (
    <Box sx={{ height: 'calc(100% - 47px)', overflow: 'hidden' }}>
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
