import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ProjectTree } from 'shared/types';

import { ProjectState } from '../types/project/index';

import { XTORY_PROJECT_STATE } from './constants';

export const initialState: ProjectState = {
  projectPath: null,
  projectTree: null!,
};

const project: any = createSlice({
  initialState,
  name: XTORY_PROJECT_STATE,
  reducers: {
    setProjectPath: (
      state: ProjectState,
      { payload }: PayloadAction<string | null>
    ) => {
      state.projectPath = payload;
    },
    setProjectTree: (
      state: ProjectState,
      { payload }: PayloadAction<ProjectTree>
    ) => {
      state.projectTree = payload;
    },
  },
});

export const { setProjectPath, setProjectTree } = project.actions;
export default project.reducer;
