import React from 'react';

import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Tooltip from '@mui/material/Tooltip';

import SnippetFolderIcon from '@mui/icons-material/SnippetFolder';
import SearchIcon from '@mui/icons-material/Search';
import GroupIcon from '@mui/icons-material/Group';
import DataObjectIcon from '@mui/icons-material/DataObject';

import TabsContainer from './Tab/TabsContainer';
import { FilesTool, FindTool, NpcsTool, VariablesTool } from './ToolBox/index';

interface LayoutProps {
  children?: React.ReactNode;
}

interface ToolBoxProps {
  activeIndex: number;
  width: number;
  quickAccessWidth: number;
  children: React.ReactNode;
}

interface MainBoxProps {
  quickAccessWidth: number;
  toolBoxWidth: number;
  children: React.ReactNode;
}

interface QuickAccessItemProps {
  icon: React.ReactNode;
  text: string;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  isActive: boolean;
}

function ToolBox({
  activeIndex,
  width,
  quickAccessWidth,
  children,
}: ToolBoxProps) {
  const visible = width > 0;
  return (
    <Box
      sx={{
        display: visible ? 'block' : 'none',
        minWidth: `${width}px`,
        height: '100vh',
        '> div': { display: 'none' },
        [`&>*:nth-of-type(${activeIndex + 1})`]: { display: 'block' },
        ml: `${quickAccessWidth}px`,
      }}
    >
      {children}
    </Box>
  );
}

function MainBox({ quickAccessWidth, toolBoxWidth, children }: MainBoxProps) {
  const ml: number = toolBoxWidth <= 0 ? quickAccessWidth : 0;
  return (
    <Box sx={{ overflow: 'auto', width: '100%', ml: `${ml}px` }}>
      {children}
    </Box>
  );
}

function QuickAccessItem({
  icon,
  text,
  onClick,
  isActive,
}: QuickAccessItemProps) {
  return (
    <ListItem key={text} disablePadding sx={{ display: 'block' }}>
      <Tooltip title={text} placement="right" arrow>
        <ListItemButton
          color="secondary"
          onClick={onClick}
          sx={{
            bgcolor: (theme) =>
              isActive ? theme.palette.background.paper : null!,
            '> div': {
              color: (theme) => (isActive ? theme.palette.primary.main : null!),
            },
            minHeight: 48,
            justifyContent: 'center',
            px: 2.5,
            '&:hover': {
              bgcolor: (theme) => theme.palette.background.paper,
              '> div': { color: (theme) => theme.palette.primary.main },
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: 'auto',
              justifyContent: 'center',
              '& > *': { fontSize: 25 },
            }}
          >
            {icon}
          </ListItemIcon>
        </ListItemButton>
      </Tooltip>
    </ListItem>
  );
}

export default function Layout({ children = null! }: LayoutProps) {
  const quickAccessWidth: number = 50;

  const [toolBoxWidth, setToolBoxWidth] = React.useState<number>(300);
  const [activeToolIndex, setActiveToolIndex] = React.useState(0);

  const handleQuickAccessClick = (index: number) => {
    if (index === activeToolIndex) {
      setToolBoxWidth(toolBoxWidth > 0 ? 0 : 300);
      return;
    }
    setActiveToolIndex(index);
    setToolBoxWidth(300);
  };

  return (
    <Box sx={{ display: 'flex', overflow: 'clip' }}>
      <MuiDrawer
        variant="permanent"
        sx={{
          '& .MuiDrawer-paper': {
            bgcolor: (theme) => theme.palette.background.default,
          },
        }}
      >
        <List sx={{ width: quickAccessWidth }}>
          {[
            { text: 'Files', icon: <SnippetFolderIcon /> },
            { text: 'Find', icon: <SearchIcon /> },
            { text: 'NPCs', icon: <GroupIcon /> },
            { text: 'Variables', icon: <DataObjectIcon /> },
          ].map((item, index) => (
            <QuickAccessItem
              key={item.text}
              text={item.text}
              icon={item.icon}
              onClick={() => handleQuickAccessClick(index)}
              isActive={activeToolIndex === index}
            />
          ))}
        </List>
      </MuiDrawer>
      <ToolBox
        activeIndex={activeToolIndex}
        width={toolBoxWidth}
        quickAccessWidth={quickAccessWidth}
      >
        <FilesTool />
        <FindTool />
        <NpcsTool />
        <VariablesTool />
      </ToolBox>
      <MainBox quickAccessWidth={quickAccessWidth} toolBoxWidth={toolBoxWidth}>
        <TabsContainer />
      </MainBox>
    </Box>
  );
}
