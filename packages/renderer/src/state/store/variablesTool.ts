import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { VariablesToolState } from '../types/toolBox';
import { XTORY_VARIABLES_TOOL_STATE } from './constants';

export const initialState: VariablesToolState = {
  isVariablesToolFocus: false,
};

const variablesTool: any = createSlice({
  initialState,
  name: XTORY_VARIABLES_TOOL_STATE,
  reducers: {
    setIsVariablesToolFocus: (
      state: VariablesToolState,
      { payload }: PayloadAction<boolean>
    ) => {
      state.isVariablesToolFocus = payload;
    },
  },
});

export const { setIsVariablesToolFocus } = variablesTool.actions;
export default variablesTool.reducer;
