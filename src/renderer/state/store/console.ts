import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { LogLevel, LogMessage } from 'shared/types';
import { ConsoleState } from 'renderer/state/types';

import { XTORY_CONSOLE_STATE } from './constants';

export const initialState: ConsoleState = {
  buffer: [],
  logLevel: LogLevel.info,
};

const console: any = createSlice({
  initialState,
  name: XTORY_CONSOLE_STATE,
  reducers: {
    pushLog: (state: ConsoleState, { payload }: PayloadAction<LogMessage>) => {
      state.buffer.push(payload);
    },
    setLogLevel: (
      state: ConsoleState,
      { payload }: PayloadAction<LogLevel>
    ) => {
      state.logLevel = payload;
    },
    clearLogs: (state: ConsoleState) => {
      state.buffer = [];
    },
  },
});

export const { pushLog, setLogLevel, clearLogs } = console.actions;
export default console.reducer;
