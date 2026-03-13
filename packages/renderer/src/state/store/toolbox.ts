import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { ToolboxState } from '../types/toolBox';
import { XTORY_TOOLBOX_STATE } from './constants';
import lskeys from '../../constants/lskeys';

const toolbox: any = createSlice({
  initialState: (): ToolboxState => {
    const savedIsOpen = localStorage.getItem(lskeys.state.toolbox.isOpen);
    let isOpen = true;
    if (savedIsOpen !== null) {
      const parsed = Boolean(savedIsOpen);
      isOpen = parsed;
    }
    return {
      isOpen,
      activeToolName: 'Files',
    };
  },
  name: XTORY_TOOLBOX_STATE,
  reducers: {
    setIsOpen: (state: ToolboxState, { payload }: PayloadAction<boolean>) => {
      localStorage.setItem(lskeys.state.toolbox.isOpen, payload.toString());
      state.isOpen = payload;
    },
    setActiveToolName: (
      state: ToolboxState,
      { payload }: PayloadAction<string>
    ) => {
      state.activeToolName = payload;
    },
  },
});

export const { setIsOpen, setActiveToolName } = toolbox.actions;
export default toolbox.reducer;
