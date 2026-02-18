import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  FilesToolState,
  ProjectTreeNodeState,
  FileMenuItem,
} from 'renderer/state/types';

import { XTORY_FILES_TOOL_STATE } from './constants';

export const initialState: FilesToolState = {
  isProjectTreeFocus: false,
  projectTreeNodeStates: {},
  fileMenuItems: [],
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
    setSelectedNode: (
      state: FilesToolState,
      { payload }: PayloadAction<string>
    ) => {
      Object.entries(state.projectTreeNodeStates).forEach(
        (kv: [string, ProjectTreeNodeState]) => {
          kv[1].isSelected = false;
        }
      );
      const oldState = state.projectTreeNodeStates[payload] || {
        nodeId: payload,
      };
      const newState = Object.assign(oldState, { isSelected: true });
      state.projectTreeNodeStates[payload] = newState;
    },
    addFileMenuItem: (
      state: FilesToolState,
      { payload }: PayloadAction<FileMenuItem>
    ) => {
      state.fileMenuItems.push(payload);
    },
  },
});

export const {
  setIsProjectTreeFocus,
  setProjectTreeNodeState,
  setSelectedNode,
  addFileMenuItem,
} = filesTool.actions;
export default filesTool.reducer;
