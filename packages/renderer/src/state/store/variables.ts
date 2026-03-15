import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { VariableInfo } from '@xtory/plugin-api';

import type { VariablesState } from '../types/project/index';

import { XTORY_VARIABLES_STATE } from './constants';

export const initialState: VariablesState = { vars: {} };

const variables: any = createSlice({
  initialState,
  name: XTORY_VARIABLES_STATE,
  reducers: {
    setVariables: (
      state: VariablesState,
      { payload }: PayloadAction<Record<string, VariableInfo>>
    ) => {
      state.vars = payload;
    },
    setVariable: (
      state: VariablesState,
      {
        payload: [key, value],
      }: PayloadAction<[key: string, value: VariableInfo]>
    ) => {
      state.vars[key] = value;
    },
    removeVariable: (
      state: VariablesState,
      { payload }: PayloadAction<string>
    ) => {
      delete state.vars[payload];
    },
  },
});

export const { setVariables, setVariable, removeVariable } = variables.actions;
export default variables.reducer;
