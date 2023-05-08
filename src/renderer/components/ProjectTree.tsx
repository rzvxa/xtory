import React from 'react';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MuiTreeView from '@mui/lab/TreeView';
import MuiTreeItem from '@mui/lab/TreeItem';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FolderIcon from '@mui/icons-material/Folder';
import ForumIcon from '@mui/icons-material/Forum';

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
  onRename,
  children,
}: DirItemProps) {
  const [newName, setNewName] = React.useState<string>(label);

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
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
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

  const onRename = (newName: string) => {
    dispatch(setProjectTreeNodeState({ nodeId, isRename: false }));
    if (name === newName) return;
    const newPath = path.split('/').slice(0, -1).join('/').concat('/', newName);
    window.electron.ipcRenderer.sendMessage(ChannelsMain.fsMove, path, newPath);
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
      icon={isDir ? <FolderIcon /> : <ForumIcon />}
      isDir={isDir}
      isRename={treeNodeState.isRename}
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
      sx={{ height: '100%', flexGrow: 1, overflowY: 'auto' }}
    >
      {projectTree && <TreeNode treeData={projectTree} />}
    </MuiTreeView>
  );
}
