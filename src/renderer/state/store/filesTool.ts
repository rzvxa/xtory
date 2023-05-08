import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { FilesToolState, ProjectTreeNodeState } from 'renderer/state/types';

import { XTORY_FILES_TOOL_STATE } from './constants';

export const initialState: FilesToolState = {
  isProjectTreeFocus: false,
  projectTreeNodeStates: {},
};

const filesTool: any = createSlice({
  initialState,
  name: XTORY_FILES_TOOL_STATE,
  reducers: {
    setIsProjectTreeFocus: (
      state: FilesToolState,
      { payload }: PayloadAction<boolean>
    ) => {
      state.isProjectTreeFocus = payload;
    },
    setProjectTreeNodeState: (
      state: FilesToolState,
      { payload }: PayloadAction<ProjectTreeNodeState>
    ) => {
      const oldState = state.projectTreeNodeStates[payload.nodeId] || {};
      const newState = Object.assign(oldState, payload);
      state.projectTreeNodeStates[payload.nodeId] = newState;
    },
  },
});

export const { setIsProjectTreeFocus, setProjectTreeNodeState } =
  filesTool.actions;
export default filesTool.reducer;
