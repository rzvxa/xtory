/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';

import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { Theme, useTheme } from '@mui/material/styles';

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';

import ForumIcon from '@mui/icons-material/Forum';
import CloseIcon from '@mui/icons-material/Close';

import { useAppDispatch, useAppSelector } from 'renderer/state/store/index';
import { setActiveTabId, setTabs, removeTab } from 'renderer/state/store/tabs';
import { TabState } from 'renderer/state/types/tabs/index';
import TabView from './TabView';

type Tab = TabState;

// a little function to help us with reordering the result
const reorder = (list: Tab[], startIndex: any, endIndex: any): Tab[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const getItemStyle = (
  theme: Theme,
  isActive: boolean,
  isDragging: boolean,
  draggableStyle: any
) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: '10px',

  cursor: 'pointer',

  // change background colour if dragging
  background:
    isDragging || isActive
      ? theme.palette.background.paper
      : theme.palette.background.default,

  display: 'flex',
  alignItems: 'center',

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (theme: Theme, isDraggingOver: boolean) => ({
  background: isDraggingOver
    ? theme.palette.background.paper
    : theme.palette.background.default,
  display: 'flex',
  overflow: 'overlay',
});

export default function TabsContainer() {
  const theme: Theme = useTheme();
  const dispatch = useAppDispatch();

  const activeTabId = useAppSelector((state) => state.tabsState.activeTabId);
  const tabs = useAppSelector((state) => state.tabsState.tabs);
  const tabRefs = React.useRef<HTMLDivElement[]>([]);

  React.useEffect(() => {
    const activeTabIndex = tabs.findIndex((t: Tab) => t.id === activeTabId);
    if (tabRefs && tabRefs.current && tabRefs.current[activeTabIndex]) {
      tabRefs?.current[activeTabIndex].scrollIntoView();
    }
  }, [tabs, activeTabId]);

  const onDragEnd = (result: DropResult) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const newItems: Tab[] = reorder(
      tabs,
      result.source.index,
      result.destination.index
    );

    dispatch(setTabs(newItems));
  };

  const handleTabClick = (index: number) => {
    dispatch(setActiveTabId(tabs[index].id));
  };

  const handleTabClose = (index: number, tabId: string) => {
    if (tabId === activeTabId) {
      const nextTabIndex = index === 0 ? 1 : index - 1;
      const nextTab = tabs[nextTabIndex];
      dispatch(setActiveTabId(nextTab?.id || null));
    }
    dispatch(removeTab(tabId));
  };

  const activeTab = tabs.find((t: Tab) => t.id === activeTabId) ?? null!;

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable" direction="horizontal">
          {(provided: any, snapshot: any) => (
            <div
              ref={provided.innerRef}
              style={getListStyle(theme, snapshot.isDraggingOver)}
              {...provided.droppableProps}
            >
              {tabs.map((item: any, index: number) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided: any, snapshot: any) => (
                    <Paper
                      ref={(el: HTMLDivElement) => {
                        tabRefs.current[index] = el;
                        provided.innerRef(el);
                      }}
                      onMouseDown={() => handleTabClick(index)}
                      onAuxClick={() => handleTabClose(index, item.id)}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        theme,
                        activeTabId === item.id,
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
                      <ForumIcon sx={{ fontSize: 15, mr: 1 }} />
                      <Typography sx={{ width: 'max-content' }}>
                        {item.title}
                      </Typography>
                      {item.isDirty && <Typography>*</Typography>}
                      <IconButton
                        sx={{
                          borderRadius: '5px',
                          width: '24px',
                          height: '24px',
                        }}
                        aria-label="Close"
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={() => handleTabClose(index, item.id)}
                      >
                        <CloseIcon sx={{ fontSize: 15 }} />
                      </IconButton>
                    </Paper>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <Divider />
      {/* body over here */}
      {activeTabId && <TabView tabId={activeTabId!} />}
    </>
  );
}
