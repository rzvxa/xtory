import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';

export interface ContextMenuItemProps {
  icon: React.ReactElement;
  label: string;
  shortcut?: string | undefined;
  onClick?: () => void | undefined;
}

export default function ContextMenuItem({
  icon,
  label,
  shortcut = undefined,
  onClick = undefined,
}: ContextMenuItemProps) {
  return (
    <MenuItem onClick={onClick}>
      <ListItemIcon>
        {React.cloneElement(icon, { fontSize: 'small' })}
      </ListItemIcon>
      <ListItemText>{label}</ListItemText>
      <Typography variant="body2" color="text.secondary">
        {shortcut}
      </Typography>
    </MenuItem>
  );
}
