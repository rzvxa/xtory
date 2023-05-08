import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import { ProjectState, TabsState, FilesToolState } from 'renderer/state/types';

import projectReducer from './project';
import filesToolReducer from './filesTool';
import tabsReducer from './tabs';

export const store = configureStore({
  reducer: {
    projectState: projectReducer,
    filesToolState: filesToolReducer,
    tabsState: tabsReducer,
  },
});

export interface Store {
  projectState: ProjectState;
  filesToolState: FilesToolState;
  tabsState: TabsState;
}

export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<Store> = useSelector;
