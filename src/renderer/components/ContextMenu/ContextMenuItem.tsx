import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

export interface ContextMenuItemProps {
  label: string;
  shortcut?: string | undefined;
  onClick?: () => void | undefined;
  onClose?: (event: React.MouseEvent) => void | undefined;
}

export default function ContextMenuItem({
  label,
  shortcut = undefined,
  onClick = undefined,
  onClose = undefined,
}: ContextMenuItemProps) {
  const clickHandler = (event: React.MouseEvent) => {
    if (onClose) {
      onClose(event);
    }
    if (onClick) {
      onClick();
    }
  };
  return (
    <MenuItem onClick={clickHandler}>
      <ListItemText>{label}</ListItemText>
      <Typography variant="body2" color="text.secondary">
        {shortcut}
      </Typography>
    </MenuItem>
  );
}
