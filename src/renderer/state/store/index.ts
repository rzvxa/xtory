import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import { ProjectState, TabsState } from '../types/index';

import projectReducer from './project';
import tabsReducer from './tabs';

export const store = configureStore({
  reducer: {
    projectState: projectReducer,
    tabsState: tabsReducer,
  },
});

export interface Store {
  projectState: ProjectState;
  tabsState: TabsState;
}

export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<Store> = useSelector;
