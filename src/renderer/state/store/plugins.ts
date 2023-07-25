import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { LogLevel, LogMessage } from 'shared/types';
import { PluginsState } from 'renderer/state/types';

import { XTORY_CONSOLE_STATE } from './constants';

export const initialState: PluginsState = {
  LoadedPlugins: [],
};

const console: any = createSlice({
  initialState,
  name: XTORY_CONSOLE_STATE,
  reducers: {
    loadPlugin: (state: PluginsState, { payload }: PayloadAction<string>) => {
      state.buffer.push(payload);
    },
    clearLogs: (state: PluginsState) => {
      state.buffer = [];
    },
  },
});

export const { pushLog, setLogLevel, clearLogs } = console.actions;
export default console.reducer;
