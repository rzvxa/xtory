import React from 'react';
import { useReactFlow } from 'reactflow';

import { useAppDispatch, useAppSelector } from 'renderer/state/store/index';
import {
  pushHistorySnapshot,
  setPastHistory,
  setFutureHistory,
} from 'renderer/state/store/tabs';
import { HistoryItem, FileTabData } from 'renderer/state/types';

import uuidv4 from 'renderer/utils/uuidv4';

type SetIsDirtyCallbackType = (isDirty: boolean) => void;

type UseUndoRedoOptions = {
  tabId: string;
  setIsDirty: SetIsDirtyCallbackType;
  maxHistorySize: number;
};

type UseUndoRedo = (options: UseUndoRedoOptions) => {
  undo: () => void;
  redo: () => void;
  takeSnapshot: () => void;
  canUndo: boolean;
  canRedo: boolean;
};

export const useUndoRedo: UseUndoRedo = ({
  tabId,
  setIsDirty,
  maxHistorySize,
}: UseUndoRedoOptions) => {
  const dispatch = useAppDispatch();
  const { now, past, future } = useAppSelector((state) => {
    const tabState = state.tabsState.tabs.find((tab) => tab.id === tabId)!;
    const tabData = tabState.tabData as FileTabData;
    return tabData.history;
  });

  const { setNodes, setEdges, getNodes, getEdges } = useReactFlow();

  const takeSnapshot = React.useCallback(() => {
    console.log('snap');
    const snapshot = { id: uuidv4(), nodes: getNodes(), edges: getEdges() };
    dispatch(pushHistorySnapshot({ id: tabId, snapshot, maxHistorySize }));
    setIsDirty(true);
  }, [getNodes, getEdges, dispatch, tabId, maxHistorySize, setIsDirty]);

  const undo = React.useCallback(() => {
    // history we want to go back to
    const pastState = past[past.length - 1];
    console.log('undo', past.length);

    if (pastState) {
      const snapshot = { id: uuidv4(), nodes: getNodes(), edges: getEdges() };
      dispatch(
        setPastHistory({ id: tabId, history: past.slice(0, past.length - 1) })
      );
      dispatch(setFutureHistory({ id: tabId, history: [...future, snapshot] }));
      setNodes(pastState.nodes);
      setEdges(pastState.edges);
    }
  }, [dispatch, tabId, past, future, setNodes, setEdges, getNodes, getEdges]);

  const redo = React.useCallback(() => {
    const futureState = future[future.length - 1];
    console.log('redo', future.length);

    if (futureState) {
      const snapshot = { id: uuidv4(), nodes: getNodes(), edges: getEdges() };
      dispatch(
        setFutureHistory({
          id: tabId,
          history: future.slice(0, future.length - 1),
        })
      );
      dispatch(
        setPastHistory({
          id: tabId,
          history: [...past, snapshot],
        })
      );
      setNodes(futureState.nodes);
      setEdges(futureState.edges);
    }
  }, [dispatch, tabId, past, future, setNodes, setEdges, getNodes, getEdges]);

  return {
    undo,
    redo,
    takeSnapshot,
    canUndo: !past.length,
    canRedo: !future.length,
  };
};

export default useUndoRedo;
