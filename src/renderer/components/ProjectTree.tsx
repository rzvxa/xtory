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

export default function ProjectTree() {
  return (
    <MuiTreeView
      aria-label="Project Tool"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      sx={{ height: '100%', flexGrow: 1, overflowY: 'auto' }}
    >
      <TreeItem
        nodeId="0"
        label="Place Holder Project Name"
        icon={<FolderIcon />}
      >
        <TreeItem nodeId="1" label="Side Quests #1" icon={<FolderIcon />}>
          <TreeItem nodeId="2" label="Start Quest Conversations.xconv" icon={<ForumIcon />} />
        </TreeItem>
        <TreeItem nodeId="5" label="Main Story" icon={<FolderIcon />}>
          <TreeItem nodeId="10" label="Main.xflow" icon={<FlowIcon />} />
          <TreeItem nodeId="6" label="Conversations" icon={<FolderIcon />}>
            <TreeItem nodeId="8" label="Tutorial Conversation.xconv" icon={<ForumIcon />} />
          </TreeItem>
        </TreeItem>
      </TreeItem>
    </MuiTreeView>
  );
}
