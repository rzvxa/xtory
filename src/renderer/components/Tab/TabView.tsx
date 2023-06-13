import React from 'react';
import TextField from '@mui/material/TextField';

import { useAppDispatch } from 'renderer/state/store/index';

import { changeTab } from 'renderer/state/store/tabs';
import { TabState } from 'renderer/state/types/tabs/index';

export interface TabViewProps {
  tabId: string;
  state: TabState;
}

export default function TabView({ tabId, state }: TabViewProps) {
  const dispatch = useAppDispatch();
  return (
    <div>
      <TextField
        id="standard-basic"
        label="Standard"
        variant="standard"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          dispatch(changeTab({ id: tabId, extra: e.target.value }));
        }}
        value={state.extra}
      />
    </div>
  );
}
