import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { PluginsState } from '../types/plugins/index';

import { XTORY_PLUGINS_STATE } from './constants';

export const initialState: PluginsState = {
  LoadedPlugins: {},
  isLoading: false,
  loadingMessage: '',
  pluginCount: 0,
  loadTime: 0,
};

const plugins: any = createSlice({
  initialState,
  name: XTORY_PLUGINS_STATE,
  reducers: {
    setPluginsLoading: (
      state: PluginsState,
      { payload }: PayloadAction<{ isLoading: boolean; message: string }>
    ) => {
      state.isLoading = payload.isLoading;
      state.loadingMessage = payload.message;
    },
    setPluginsLoaded: (
      state: PluginsState,
      { payload }: PayloadAction<{ pluginCount: number; loadTime: number }>
    ) => {
      state.isLoading = false;
      state.loadingMessage = '';
      state.pluginCount = payload.pluginCount;
      state.loadTime = payload.loadTime;
    },
  },
});

export const { setPluginsLoading, setPluginsLoaded } = plugins.actions;
export default plugins.reducer;
