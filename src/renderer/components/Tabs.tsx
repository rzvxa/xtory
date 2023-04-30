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

interface Tab {
  id: string;
  title: string;
}

// fake data generator
const getItems = (count: any): Tab[] =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k}`,
    title: `Conversation-${k}.xconv`,
  }));

// a little function to help us with reordering the result
const reorder = (list: Tab[], startIndex: any, endIndex: any): Tab[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const getItemStyle = (
  index: number,
  theme: Theme,
  isDragging: any,
  draggableStyle: any
) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: '10px',

  cursor: 'pointer',

  // change background colour if dragging
  background:
    isDragging || index === 0
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
  overflow: 'auto',
});

export default function Tabs() {
  const theme: Theme = useTheme();
  const [items, setItems] = React.useState<Tab[]>(getItems(6));

  const onDragEnd = (result: DropResult) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const newItems: Tab[] = reorder(
      items,
      result.source.index,
      result.destination.index
    );

    setItems(newItems);
  };

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
              {items.map((item: any, index: number) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided: any, snapshot: any) => (
                    <Paper
                      onClick={() => console.log('CLCIK')}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        index,
                        theme,
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
                      <ForumIcon sx={{ fontSize: 15, mr: 1 }} />
                      <Typography sx={{ width: 'max-content' }}>
                        {item.title}
                      </Typography>
                      <IconButton
                        sx={{
                          borderRadius: '5px',
                          width: '24px',
                          height: '24px',
                        }}
                        aria-label="Close"
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
    </>
  );
}
