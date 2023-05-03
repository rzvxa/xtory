import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProjectState } from '../types/project/index';

import { XTORY_PROJECT_STATE } from './constants';

export const initialState: ProjectState = {
  projectPath: null,
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
  },
});

export const { setProjectPath } = project.actions;
export default project.reducer;
