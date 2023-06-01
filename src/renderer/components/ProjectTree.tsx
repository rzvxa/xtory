import React from 'react';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MuiTreeView from '@mui/lab/TreeView';
import MuiTreeItem from '@mui/lab/TreeItem';
import Divider from '@mui/material/Divider';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FolderEmptyIcon from '@mui/icons-material/FolderOpen';
import FolderIcon from '@mui/icons-material/Folder';
import ConvIcon from '@mui/icons-material/Forum';

import {
  Platform,
  ChannelsMain,
  ProjectTree as ProjectTreeState,
  ProjectTreeNode,
} from 'shared/types';

import { useAppSelector, useAppDispatch } from 'renderer/state/store';
import {
  ProjectTreeNodeState,
  ProjectTreeNodeStates,
} from 'renderer/state/types';
import {
  setIsProjectTreeFocus,
  setProjectTreeNodeState,
  setSelectedNode,
} from 'renderer/state/store/filesTool';

import { ContextMenu, ContextMenuItem } from './ContextMenu';

interface DirItemProps {
  nodeId: string;
  root: boolean;
  label: string;
  icon: React.ReactNode;
  isDir: boolean;
  // undefined if isDir is false
  isExpanded: boolean | undefined;
  isRename: boolean;
  onExpandToggle: () => void;
  onNewFolder: () => void;
  onReveal: () => void;
  onDelete: () => void;
  onRename: () => void;
  onRenameDone: (newName: string) => void;
  children: React.ReactNode | undefined;
}

const NewNameTextInput = styled(TextField)(() => ({
  '& .MuiInputBase-input': {
    padding: '0 0 0 10px',
  },
}));

function TreeItem({
  nodeId,
  root,
  label,
  icon,
  isDir,
  isRename,
  isExpanded,
  onExpandToggle,
  onNewFolder,
  onReveal,
  onDelete,
  onRename,
  onRenameDone,
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

  const revealPathInOS = [
    [Platform.win32, 'Reveal in File Explorer'],
    [Platform.darwin, 'Reveal in Finder'],
    [Platform.linux, 'Open Containing Folder'],
  ].reduce((accumulator, current, index, array) => {
    const [flag, value] = current;
    if (index === array.length - 1 && accumulator === '') return value;
    if (window.platform === flag) return value;
    return accumulator;
  }, '');

  return (
    <MuiTreeItem
      key={nodeId}
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

          <ContextMenu
            open={contextMenu !== null}
            onClose={handleClose}
            anchorPosition={
              contextMenu !== null
                ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                : undefined
            }
          >
            {isDir ? (
              [
                <ContextMenuItem
                  key="1"
                  label={isExpanded ? 'Collapse' : 'Expand'}
                  shortcut="Enter"
                  onClick={onExpandToggle}
                />,
                <ContextMenuItem
                  key="2"
                  label="New Folder"
                  shortcut="Ctrl + Shift + N"
                  onClick={onNewFolder}
                />,
              ]
            ) : (
              <ContextMenuItem label="Open" shortcut="Enter" />
            )}
            <Divider variant="middle" />
            <ContextMenuItem label={revealPathInOS} onClick={onReveal} />,
            <Divider variant="middle" />
            <ContextMenuItem label="Copy Path" shortcut="Shift + Alt + C" />
            ,
            <ContextMenuItem label="Copy Relative Path" />,
            {root || [
              <Divider key="1" variant="middle" />,
              <ContextMenuItem
                key="2"
                label="Rename..."
                shortcut="F2"
                onClick={onRename}
              />,
              <ContextMenuItem
                key="3"
                label="Delete"
                shortcut="Delete"
                onClick={onDelete}
              />,
            ]}
          </ContextMenu>
        </Box>
      }
    >
      {children}
    </MuiTreeItem>
  );
}

interface TreeNodeProps {
  treeData: ProjectTreeState | ProjectTreeNode;
  root?: boolean;
}

function TreeNode({ treeData, root = false }: TreeNodeProps) {
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

  const onExpandToggle = () => {
    dispatch(
      setProjectTreeNodeState({ nodeId, isExpanded: !treeNodeState.isExpanded })
    );
  };

  const onNewFolder = async () => {
    const basePath = `${path}/New Folder`;
    let newPath;
    let newCount = 0;
    while (newCount >= 0) {
      /* eslint-disable no-await-in-loop */
      newPath = basePath + (newCount === 0 ? '' : ` ${newCount}`);
      if (
        !(await window.electron.ipcRenderer.invoke(
          ChannelsMain.fspExists,
          newPath
        ))
      ) {
        await window.electron.ipcRenderer.invoke(
          ChannelsMain.fspMkdir,
          newPath
        );
        newCount = -1;
        break;
      }
      newCount++;
      /* eslint-enable no-await-in-loop */
    }
    dispatch(setSelectedNode(newPath));
    dispatch(setProjectTreeNodeState({ nodeId, isExpanded: true }));
    dispatch(setProjectTreeNodeState({ nodeId: newPath, isRename: true }));
  };

  const onReveal = () => {
    window.electron.ipcRenderer.sendMessage(ChannelsMain.revealPathInOS, path);
  };

  const onDelete = () => {
    window.electron.ipcRenderer.sendMessage(ChannelsMain.fsRemove, path);
  };

  const onRename = () => {
    // setting a timeout to let this render call ends!
    setTimeout(() =>
      dispatch(setProjectTreeNodeState({ nodeId, isRename: true }))
    );
  };

  const onRenameDone = (newName: string) => {
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
    }
    return <FolderEmptyIcon />;
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
      root={root}
      nodeId={nodeId}
      label={name}
      icon={icon()}
      isDir={isDir}
      isExpanded={treeNodeState.isExpanded}
      isRename={treeNodeState.isRename}
      onExpandToggle={onExpandToggle}
      onNewFolder={onNewFolder}
      onReveal={onReveal}
      onDelete={onDelete}
      onRename={onRename}
      onRenameDone={onRenameDone}
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
  const projectTreeStates: ProjectTreeNodeStates = useAppSelector(
    (state) => state.filesToolState.projectTreeNodeStates
  );

  const onFocus = () => {
    dispatch(setIsProjectTreeFocus(true));
  };

  const onBlur = () => {
    dispatch(setIsProjectTreeFocus(false));
  };

  const selected = Object.entries(projectTreeStates)
    .filter((kv: [string, ProjectTreeNodeState]) => kv[1].isSelected)
    .map((kv: [string, ProjectTreeNodeState]) => kv[0]);

  const onNodeSelect = (event: React.SyntheticEvent, nodeId: string) => {
    dispatch(setSelectedNode(nodeId));
  };

  const expanded = Object.entries(projectTreeStates)
    .filter((kv: [string, ProjectTreeNodeState]) => kv[1].isExpanded)
    .map((kv: [string, ProjectTreeNodeState]) => kv[0]);
  const onNodeToggle = (event: React.SyntheticEvent, nodeIds: string[]) => {
    const newIds = nodeIds.filter((id) => !expanded.includes(id));
    const removedIds = expanded.filter((id) => !nodeIds.includes(id));
    newIds.map((id) =>
      dispatch(setProjectTreeNodeState({ nodeId: id, isExpanded: true }))
    );
    removedIds.map((id) =>
      dispatch(setProjectTreeNodeState({ nodeId: id, isExpanded: false }))
    );
  };

  return (
    <MuiTreeView
      onNodeSelect={(e: any, i: any) => onNodeSelect(e, i as string)}
      selected={selected}
      onNodeToggle={onNodeToggle}
      expanded={expanded}
      onFocus={onFocus}
      onBlur={onBlur}
      aria-label="Project Tool"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      sx={{ flexGrow: 1, overflowY: 'auto' }}
    >
      {projectTree && <TreeNode treeData={projectTree} root />}
    </MuiTreeView>
  );
}
