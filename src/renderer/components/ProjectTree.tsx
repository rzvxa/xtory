import React from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MuiTreeView from '@mui/lab/TreeView';
import MuiTreeItem from '@mui/lab/TreeItem';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FlowIcon from '@mui/icons-material/AccountTree';
import FolderIcon from '@mui/icons-material/Folder';
import ForumIcon from '@mui/icons-material/Forum';

import { ProjectTree as ProjectTreeState, ProjectTreeNode } from 'shared/types';

import { useAppSelector } from 'renderer/state/store/index';

interface DirItemProps {
  nodeId: string;
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode | undefined;
}

function TreeItem({ nodeId, label, icon, children }: DirItemProps) {
  return (
    <MuiTreeItem
      nodeId={nodeId}
      label={
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', ml: -0.5, mr: 1, fontSize: 18 }}>
            {icon}
          </Box>
          <Typography
            variant="body2"
            sx={{ fontWeight: 'inherit', flexGrow: 1 }}
          >
            {label}
          </Typography>
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
  const { name, path, isDir, children } = treeData;

  return (
    <TreeItem
      nodeId={path}
      label={name}
      icon={isDir ? <FolderIcon /> : <ForumIcon />}
    >
      {children &&
        Object.entries(children).map(([_, node]) => (
          <TreeNode treeData={node} />
        ))}
    </TreeItem>
  );
}

export default function ProjectTree() {
  const projectTree: ProjectTreeState = useAppSelector(
    (state) => state.projectState.projectTree
  );

  return (
    <MuiTreeView
      aria-label="Project Tool"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      sx={{ height: '100%', flexGrow: 1, overflowY: 'auto' }}
    >
      {projectTree && <TreeNode treeData={projectTree} />}
    </MuiTreeView>
  );
}
