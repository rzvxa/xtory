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

interface ToolBoxProps {
  activeIndex: number;
  display: boolean;
  height: number | string;
  width: number | string;
  children: React.ReactNode;
}

interface MainBoxProps {
  height: string;
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
  display,
  height,
  width,
  children,
}: ToolBoxProps) {
  return (
    <Box
      sx={{
        display: display ? 'block' : 'none',
        minWidth: `${width}px`,
        height,
        '> div': { display: 'none' },
        [`&>*:nth-of-type(${activeIndex + 1})`]: { display: 'block' },
      }}
    >
      {children}
    </Box>
  );
}

function MainBox({ height, children }: MainBoxProps) {
  return <Box sx={{ overflow: 'auto', height, width: '100%' }}>{children}</Box>;
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

export default function Layout() {
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
    <Box sx={{ display: 'flex', overflow: 'clip', height: '100vh' }}>
      <Paper
        sx={{
          bgcolor: (theme) => theme.palette.background.default,
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
      </Paper>
      <ToolBox
        activeIndex={activeToolIndex}
        display={toolBoxWidth > 0}
        height="100vh"
        width={toolBoxWidth}
      >
        <FilesTool />
        <FindTool />
        <NpcsTool />
        <VariablesTool />
      </ToolBox>
      <Box
        sx={{ width: `calc(100% - ${quickAccessWidth}px - ${toolBoxWidth}px)` }}
      >
        <MainBox height="calc(100% - 200px)">
          <TabsContainer />
        </MainBox>
        <ToolBox
          activeIndex={activeToolIndex}
          display={true}
          height="200px"
          width="100%"
        >
          <FilesTool />
          <FindTool />
          <NpcsTool />
          <VariablesTool />
        </ToolBox>
      </Box>
    </Box>
  );
}
