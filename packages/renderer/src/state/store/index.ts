import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import {
  ProjectState,
  TabsState,
  FilesToolState,
  VariablesToolState,
  ToolboxState,
  ConsoleState,
  PluginsState,
  VariablesState,
} from 'renderer/state/types';

import projectReducer from './project';
import variablesReducer from './variables';
import filesToolReducer from './filesTool';
import variablesToolReducer from './variablesTool';
import tabsReducer from './tabs';
import toolboxState from './toolbox';
import consoleReducer from './console';
import pluginsReducer from './plugins';
import * as constants from './constants';

export const store = configureStore({
  reducer: {
    [constants.XTORY_PROJECT_STATE]: projectReducer,
    [constants.XTORY_VARIABLES_STATE]: variablesReducer,
    [constants.XTORY_FILES_TOOL_STATE]: filesToolReducer,
    [constants.XTORY_VARIABLES_TOOL_STATE]: variablesToolReducer,
    [constants.XTORY_TABS_STATE]: tabsReducer,
    [constants.XTORY_TOOLBOX_STATE]: toolboxState,
    [constants.XTORY_CONSOLE_STATE]: consoleReducer,
    [constants.XTORY_PLUGINS_STATE]: pluginsReducer,
  },
});

export interface Store {
  [constants.XTORY_PROJECT_STATE]: ProjectState;
  [constants.XTORY_VARIABLES_STATE]: VariablesState;
  [constants.XTORY_FILES_TOOL_STATE]: FilesToolState;
  [constants.XTORY_VARIABLES_TOOL_STATE]: VariablesToolState;
  [constants.XTORY_TABS_STATE]: TabsState;
  [constants.XTORY_TOOLBOX_STATE]: ToolboxState;
  [constants.XTORY_CONSOLE_STATE]: ConsoleState;
  [constants.XTORY_PLUGINS_STATE]: PluginsState;
}

export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<Store> = useSelector;
