import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import {
  ProjectState,
  TabsState,
  FilesToolState,
  ConsoleState,
} from 'renderer/state/types';

import projectReducer from './project';
import filesToolReducer from './filesTool';
import tabsReducer from './tabs';
import consoleReducer from './console';

export const store = configureStore({
  reducer: {
    projectState: projectReducer,
    filesToolState: filesToolReducer,
    tabsState: tabsReducer,
    consoleState: consoleReducer,
  },
});

export interface Store {
  projectState: ProjectState;
  filesToolState: FilesToolState;
  tabsState: TabsState;
  consoleState: ConsoleState;
}

export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<Store> = useSelector;
