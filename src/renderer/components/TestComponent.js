import React, { useState } from "react";
import { Tabs, Tab } from '@mui/material';

import { DragDropContext, Draggable } from "react-beautiful-dnd";
import { StrictModeDroppable } from "./StrictModeDroppable";

import styles from './TestComponent.module.scss';


export default function TestComponent() {
  const [activeTab, setActiveTab] = useState(0);
  const [tabs, setTabs] = useState([
    { id: 1, label: "One" },
    { id: 2, label: "Two" },
    { id: 3, label: "Threasdasdsadasde" },
    { id: 4, label: "Four" }
  ]);

  const [lastPlace, setLastPlace] = useState(0)

  const onDragEnd = (result) => {
    if (!result.destination) return;
    if (result.destination === lastPlace) return;
    const srcIndex = lastPlace < 0 ? result.source.index : lastPlace

    const newTabs = Array.from(tabs);
    const [removed] = newTabs.splice(srcIndex, 1);
    newTabs.splice(result.destination.index, 0, removed);
    setTabs(newTabs);
    setActiveTab(result.destination.index);
    setLastPlace(-1);
  };

  const onDragUpdate = (result) => {
    if (!result.destination) return;
    if (result.destination === lastPlace) return;
    const srcIndex = lastPlace < 0 ? result.source.index : lastPlace

    const newTabs = Array.from(tabs);
    const [removed] = newTabs.splice(srcIndex, 1);
    newTabs.splice(result.destination.index, 0, removed);
    setTabs(newTabs);
    setActiveTab(result.destination.index)
    setLastPlace(result.destination.index);
  };

  const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
  
    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'grey',
  
    // styles we need to apply on draggables
    ...draggableStyle,
  });

  const drawPlaceholder = (snapshot, placeholder) => {

    if (snapshot.isUsingPlaceholder)
      return (<>  <div className={styles["tabStyle"]}>{placeholder}</div></>);
  }

  return (
      <DragDropContext
        onDragEnd={onDragEnd}
        onDragUpdate={onDragUpdate}
      >
        <StrictModeDroppable droppableId="tabs" direction="horizontal">
          {(props, snapshot) => (
            <Tabs
              ref={props.innerRef}
              className={styles['tab-container']}
              {...props.droppableProps}
              value={activeTab}
              //onChange={handleTabChange} Not used
            >
              {tabs.map(({ id, label }, index) => (
                <Draggable
                  key={id}
                  draggableId={`id-${id}`} // must be a string
                  index={index}
                  disableInteractiveElementBlocking={true}
                >
                  {(props, snapshot) => (
                    <Tab
                      ref={props.innerRef}
                      style={getItemStyle(
                        snapshot.isDragging,
                        props.draggableProps.style
                      )}
                      {...props.draggableProps}
                      {...props.dragHandleProps}
                      label={label}
                      onClick={() => setActiveTab(index)} // Set active tab like this
                    />
                  )}
                </Draggable>
              ))}
              {drawPlaceholder(snapshot, props.placeholder)}
            </Tabs>
          )}
        </StrictModeDroppable>
      </DragDropContext>
  );
}
