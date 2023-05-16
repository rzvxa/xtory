import React from 'react';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MuiTreeView from '@mui/lab/TreeView';
import MuiTreeItem from '@mui/lab/TreeItem';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FolderEmptyIcon from '@mui/icons-material/FolderOpen';
import FolderIcon from '@mui/icons-material/Folder';
import ConvIcon from '@mui/icons-material/Forum';

import {
  ChannelsMain,
  ProjectTree as ProjectTreeState,
  ProjectTreeNode,
} from 'shared/types';

import { useAppSelector, useAppDispatch } from 'renderer/state/store';
import { ProjectTreeNodeState } from 'renderer/state/types';
import {
  setIsProjectTreeFocus,
  setProjectTreeNodeState,
} from 'renderer/state/store/filesTool';

interface DirItemProps {
  nodeId: string;
  label: string;
  icon: React.ReactNode;
  isDir: boolean;
  isRename: boolean;
  onDelete: () => void;
  onRename: (newName: string) => void;
  children: React.ReactNode | undefined;
}

const NewNameTextInput = styled(TextField)(() => ({
  '& .MuiInputBase-input': {
    padding: '0 0 0 10px',
  },
}));

function TreeItem({
  nodeId,
  label,
  icon,
  isDir,
  isRename,
  onDelete,
  onRename,
  children,
}: DirItemProps) {
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

  const handleClose = () => {
    setContextMenu(null);
  };

  const handleKeyPress = React.useCallback(
    (event: KeyboardEvent) => {
      if (!isRename) return;
      if (event.key === 'Enter') {
        onRename(newName);
      }
    },
    [isRename, onRename, newName]
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
    onRename(newName);
  };

  return (
    <MuiTreeItem
      nodeId={nodeId}
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

          <Menu
            open={contextMenu !== null}
            onClose={handleClose}
            anchorReference="anchorPosition"
            disableScrollLock
            anchorPosition={
              contextMenu !== null
                ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                : undefined
            }
          >
            <MenuItem
              onClick={() => {
                handleClose();
                onDelete();
              }}
            >
              Delete
            </MenuItem>
            <MenuItem onClick={handleClose}>Rename</MenuItem>
            <MenuItem onClick={handleClose}>Open</MenuItem>
          </Menu>
        </Box>
      }
    >
      {children}
    </MuiTreeItem>
  );
}

interface TreeNodeProps {
  treeData: ProjectTreeState | ProjectTreeNode;
}

function TreeNode({ treeData }: TreeNodeProps) {
  const dispatch = useAppDispatch();
  const { name, path, isDir, children } = treeData;
  const nodeId = path;

  const treeNodeState: ProjectTreeNodeState | undefined = useAppSelector(
    (state) => state.filesToolState.projectTreeNodeStates[nodeId] || {}
  );
  const isProjectTreeFocus: boolean = useAppSelector(
    (state) => state.filesToolState.isProjectTreeFocus
  );

  const handleKeyPress = React.useCallback(
    (event: KeyboardEvent) => {
      if (!isProjectTreeFocus) return;
      if (!treeNodeState.isSelected) return;
      if (event.key === 'F2') {
        dispatch(setProjectTreeNodeState({ nodeId, isRename: true }));
      }
    },
    [nodeId, isProjectTreeFocus, treeNodeState.isSelected, dispatch]
  );

  const onDelete = () => {
    window.electron.ipcRenderer.sendMessage(ChannelsMain.fsRemove, path);
  };

  const onRename = (newName: string) => {
    dispatch(setProjectTreeNodeState({ nodeId, isRename: false }));
    if (name === newName) return;
    const newPath = path.split('/').slice(0, -1).join('/').concat('/', newName);
    window.electron.ipcRenderer.sendMessage(ChannelsMain.fsMove, path, newPath);
  };

  const icon = () => {
    if (!isDir) {
      // file icon
      return <ConvIcon />;
    }
    if (children) {
      return <FolderIcon />;
    } else {
      return <FolderEmptyIcon />;
    }
  };

  React.useEffect(() => {
    // attach the event listener
    document.addEventListener('keydown', handleKeyPress);

    // remove the event listener
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <TreeItem
      nodeId={nodeId}
      label={name}
      icon={icon()}
      isDir={isDir}
      isRename={treeNodeState.isRename}
      onDelete={onDelete}
      onRename={onRename}
    >
      {children &&
        Object.entries(children)
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([_, node]) => <TreeNode key={node.path} treeData={node} />)}
    </TreeItem>
  );
}

export default function ProjectTree() {
  const dispatch = useAppDispatch();
  const projectTree: ProjectTreeState = useAppSelector(
    (state) => state.projectState.projectTree
  );

  const [lastSelected, setLastSelected] = React.useState<string | null>(null);

  const onFocus = () => {
    dispatch(setIsProjectTreeFocus(true));
  };

  const onBlur = () => {
    dispatch(setIsProjectTreeFocus(false));
  };

  const onNodeSelect = (event: React.SyntheticEvent, nodeId: string) => {
    if (lastSelected) {
      dispatch(
        setProjectTreeNodeState({
          nodeId: lastSelected,
          isSelected: false,
        })
      );
    }
    dispatch(setProjectTreeNodeState({ nodeId, isSelected: true }));
    setLastSelected(nodeId);
  };

  return (
    <MuiTreeView
      onNodeSelect={onNodeSelect}
      onFocus={onFocus}
      onBlur={onBlur}
      aria-label="Project Tool"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      sx={{ flexGrow: 1, overflowY: 'auto' }}
    >
      {projectTree && <TreeNode treeData={projectTree} />}
    </MuiTreeView>
  );
}
