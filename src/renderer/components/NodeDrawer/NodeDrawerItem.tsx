import React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

export interface NodeDrawerItemProps {
  key: string;
  label: string;
  selected: boolean;
  onClick?: () => void | undefined;
  onClose?: (event: React.MouseEvent) => void | undefined;
}

export default function NodeDrawerItem({
  key,
  label,
  selected,
  onClick = undefined,
  onClose = undefined,
}: NodeDrawerItemProps) {
  const clickHandler = (event: React.MouseEvent) => {
    if (onClose) {
      onClose(event);
    }
    if (onClick) {
      onClick();
    }
  };
  return (
    <ListItemButton key={key} onClick={clickHandler} selected={selected}>
      <ListItemText>{label}</ListItemText>
    </ListItemButton>
  );
}
