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
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import GroupIcon from '@mui/icons-material/Group';
import LocationOnIcon from '@mui/icons-material/LocationOn';

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
        width: `${width}px`,
        height: '100vh',
        div: { display: 'none' },
        [`&>*:nth-child(${activeIndex + 1})`]: { display: 'block' },
        ml: `${quickAccessWidth}px`,
      }}
    >
      {children}
    </Box>
  );
}

function MainBox({ quickAccessWidth, toolBoxWidth, children }: MainBoxProps) {
  const ml: number = toolBoxWidth <= 0 ? quickAccessWidth : 0;
  return <Box sx={{ ml: `${ml}px` }}>{children}</Box>;
}

function QuickAccessItem({ icon, text, onClick }: QuickAccessItemProps) {
  return (
    <ListItem key={text} disablePadding sx={{ display: 'block' }}>
      <Tooltip title={text} placement="right" arrow>
        <ListItemButton
          onClick={onClick}
          sx={{
            minHeight: 48,
            justifyContent: 'center',
            px: 2.5,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: 'auto',
              justifyContent: 'center',
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
    <Box sx={{ display: 'flex' }}>
      <MuiDrawer variant="permanent">
        <List sx={{ width: quickAccessWidth }}>
          {[
            { text: 'Files', icon: <SnippetFolderIcon /> },
            { text: 'Flow', icon: <AccountTreeIcon /> },
            { text: 'NPCs', icon: <GroupIcon /> },
            { text: 'Locations', icon: <LocationOnIcon /> },
          ].map((item, index) => (
            <QuickAccessItem
              text={item.text}
              icon={item.icon}
              onClick={() => handleQuickAccessClick(index)}
            />
          ))}
        </List>
      </MuiDrawer>
      <ToolBox
        activeIndex={activeToolIndex}
        width={toolBoxWidth}
        quickAccessWidth={quickAccessWidth}
      >
        <Paper sx={{ height: '100%' }}>Files</Paper>
        <Paper sx={{ height: '100%' }}>Flow</Paper>
        <Paper sx={{ height: '100%' }}>NPCs</Paper>
        <Paper sx={{ height: '100%' }}>Locations</Paper>
      </ToolBox>
      <MainBox quickAccessWidth={quickAccessWidth} toolBoxWidth={toolBoxWidth}>
        <>
          <div>BODY</div>
          {children}
        </>
      </MainBox>
    </Box>
  );
}
