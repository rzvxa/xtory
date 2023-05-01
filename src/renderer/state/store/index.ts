import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import { TabsState } from '../types/tabs/index';

import tabsReducer from './tabs';

export const store = configureStore({
  reducer: {
    tabsState: tabsReducer,
  },
});

export interface Store {
  tabsState: TabsState;
}

export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<Store> = useSelector;
