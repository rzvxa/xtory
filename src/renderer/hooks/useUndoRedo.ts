import React from 'react';
import { useReactFlow } from 'reactflow';

import { useAppDispatch, useAppSelector } from 'renderer/state/store/index';
import {
  setActiveHistory,
  setPastHistory,
  setFutureHistory,
} from 'renderer/state/store/tabs';
import { FileTabData } from 'renderer/state/types';

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

const useUndoRedo: UseUndoRedo = ({
  tabId,
  setIsDirty,
  maxHistorySize,
}: UseUndoRedoOptions) => {
  const dispatch = useAppDispatch();
  const { activeHistory, past, future } = useAppSelector((state) => {
    const tabState = state.tabsState.tabs.find((tab) => tab.id === tabId)!;
    const tabData = tabState.tabData as FileTabData;
    return tabData.history;
  });

  const { setNodes, setEdges, getNodes, getEdges } = useReactFlow();

  const takeSnapshot = React.useCallback(() => {
    const snapshot = { id: uuidv4(), nodes: getNodes(), edges: getEdges() };

    dispatch(
      setPastHistory({
        id: tabId,
        history: [
          ...past.slice(past.length - maxHistorySize + 1, past.length),
          snapshot,
        ],
      })
    );
    dispatch(setFutureHistory({ id: tabId, history: [] }));

    dispatch(setActiveHistory({ id: tabId, activeHistory: snapshot }));

    setIsDirty(true);
  }, [getNodes, getEdges, past, dispatch, tabId, maxHistorySize, setIsDirty]);

  const undo = React.useCallback(() => {
    // history we want to go back to
    const pastState = past[past.length - 1];

    if (pastState) {
      let snapshot = {
        id: uuidv4(),
        nodes: getNodes(),
        edges: getEdges(),
      };
      // create new snapshot if we have no future entries.
      if (future.length > 0 && activeHistory) snapshot = activeHistory;
      dispatch(
        setPastHistory({ id: tabId, history: past.slice(0, past.length - 1) })
      );
      dispatch(setFutureHistory({ id: tabId, history: [...future, snapshot] }));
      dispatch(setActiveHistory({ id: tabId, activeHistory: pastState }));

      setNodes(pastState.nodes);
      setEdges(pastState.edges);
    }
  }, [
    dispatch,
    tabId,
    activeHistory,
    past,
    future,
    setNodes,
    setEdges,
    getNodes,
    getEdges,
  ]);

  const redo = React.useCallback(() => {
    const futureState = future[future.length - 1];

    if (futureState) {
      const snapshot = activeHistory || {
        id: uuidv4(),
        nodes: getNodes(),
        edges: getEdges(),
      };
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
      dispatch(setActiveHistory({ id: tabId, activeHistory: futureState }));

      setNodes(futureState.nodes);
      setEdges(futureState.edges);
    }
  }, [
    dispatch,
    tabId,
    activeHistory,
    past,
    future,
    setNodes,
    setEdges,
    getNodes,
    getEdges,
  ]);

  return {
    undo,
    redo,
    takeSnapshot,
    canUndo: !past.length,
    canRedo: !future.length,
  };
};

export default useUndoRedo;
