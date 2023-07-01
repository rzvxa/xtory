import React from 'react';

import { styled } from '@mui/material/styles';

import Box from '@mui/material/Box';
import MuiTreeItem from '@mui/lab/TreeItem';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { ContextMenu, ContextMenuItem } from 'renderer/components/ContextMenu';

export interface TreeItemProps {
  nodeId: string;
  label: string;
  icon: React.ReactNode;
  isDir: boolean;
  // undefined if isDir is false
  isRename: boolean;
  onRenameDone: (newName: string) => void;
  onDoubleClick: () => void;
  onCollapse: () => void;
  onExpand: () => void;
  contextMenuItems: React.ReactNode[];
  children: React.ReactNode | undefined;
}

const NewNameTextInput = styled(TextField)(() => ({
  '& .MuiInputBase-input': {
    padding: '0 0 0 10px',
  },
}));

export default function TreeItem({
  nodeId,
  label,
  icon,
  isDir,
  isRename,
  onRenameDone,
  onDoubleClick,
  onCollapse,
  onExpand,
  contextMenuItems,
  children,
}: TreeItemProps) {
  const [newName, setNewName] = React.useState<string>(label);
  const [contextMenu, setContextMenu] = React.useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
          // Other native context menus might behave different.
          // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
          null
    );
  };

  const handleClose = (event: React.MouseEvent | React.KeyboardEvent) => {
    event.stopPropagation();
    event.preventDefault();
    setContextMenu(null);
  };

  const handleKeyPress = React.useCallback(
    (event: KeyboardEvent) => {
      if (!isRename) return;
      if (event.key === 'Escape') {
        onRenameDone(label);
      } else if (event.key === 'Enter') {
        onRenameDone(newName);
      }
    },
    [isRename, onRenameDone, newName, label]
  );

  React.useEffect(() => {
    // attach the event listener
    document.addEventListener('keydown', handleKeyPress);

    // remove the event listener
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  const onNewNameFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    if (!isDir) {
      const lastIndexOfDot = newName.lastIndexOf('.');
      event.target.setSelectionRange(0, lastIndexOfDot);
    } else {
      event.target.select();
    }
  };

  const onNewNameBlur = () => {
    onRenameDone(newName);
  };

  return (
    <MuiTreeItem
      key={nodeId}
      nodeId={nodeId}
      onDoubleClick={onDoubleClick}
      collapseIcon={<ExpandMoreIcon onClick={onCollapse} />}
      expandIcon={<ChevronRightIcon onClick={onExpand} />}
      label={
        <Box
          onContextMenu={handleContextMenu}
          sx={{ display: 'flex', alignItems: 'center', cursor: 'context-menu' }}
        >
          <Box sx={{ display: 'flex', ml: -0.5, mr: 1, fontSize: 18 }}>
            {icon}
          </Box>
          {isRename ? (
            <NewNameTextInput
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onFocus={onNewNameFocus}
              onBlur={onNewNameBlur}
              autoFocus
            />
          ) : (
            <Typography
              variant="body2"
              sx={{ fontWeight: 'inherit', flexGrow: 1 }}
            >
              {label}
            </Typography>
          )}

          <ContextMenu
            open={contextMenu !== null}
            onClose={handleClose}
            anchorPosition={
              contextMenu !== null
                ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                : undefined
            }
          >
            {contextMenuItems}
          </ContextMenu>
        </Box>
      }
    >
      {children}
    </MuiTreeItem>
  );
}
