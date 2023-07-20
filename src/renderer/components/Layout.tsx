import React from 'react';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Tooltip from '@mui/material/Tooltip';

import SnippetFolderIcon from '@mui/icons-material/SnippetFolder';
import SearchIcon from '@mui/icons-material/Search';
import GroupIcon from '@mui/icons-material/Group';
import DataObjectIcon from '@mui/icons-material/DataObject';
import TerminalIcon from '@mui/icons-material/Terminal';

import TabsContainer from './Tab/TabsContainer';
import {
  ToolBox,
  FilesTool,
  FindTool,
  NpcsTool,
  VariablesTool,
  ConsoleTool,
} from './ToolBox/index';

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

interface StatusBarItemProps {
  icon: React.ReactNode;
  text: string;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  isActive: boolean;
  height: string;
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

function StatusBarItem({
  icon,
  text,
  onClick,
  isActive,
  height,
}: StatusBarItemProps) {
  return (
    <Box key={text} sx={{ height }}>
      <Tooltip title={text} placement="top" arrow>
        <Box
          onClick={onClick}
          sx={{
            height,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            paddingRight: 1,
            bgcolor: (theme) =>
              isActive ? theme.palette.background.paper : null!,
            color: (theme) => (isActive ? theme.palette.primary.main : null!),
          }}
        >
          {icon}
          <Typography variant="caption" sx={{ paddingLeft: 1 }}>
            {text}
          </Typography>
        </Box>
      </Tooltip>
    </Box>
  );
}

export default function Layout() {
  const quickAccessWidth: number = 50;
  const [primaryToolBoxWidth, setPrimaryToolBoxWidth] =
    React.useState<number>(300);
  const [bottomToolBoxHeight, setBottomToolBoxHeight] =
    React.useState<number>(0);
  const [activePrimaryToolIndex, setActivePrimaryToolIndex] = React.useState(0);
  const [activeBottomToolIndex, setActiveBottomToolIndex] = React.useState(0);

  const displayPrimaryToolBox = primaryToolBoxWidth > 0;
  const displayBottomToolBox = bottomToolBoxHeight > 0;

  const handleQuickAccessClick = (index: number) => {
    if (index === activePrimaryToolIndex) {
      setPrimaryToolBoxWidth(primaryToolBoxWidth > 0 ? 0 : 300);
      return;
    }
    setActivePrimaryToolIndex(index);
    setPrimaryToolBoxWidth(300);
  };

  const handleStatusBarClick = (index: number) => {
    if (index === activeBottomToolIndex) {
      setBottomToolBoxHeight(bottomToolBoxHeight > 0 ? 0 : 200);
      return;
    }
    setActiveBottomToolIndex(index);
    setBottomToolBoxHeight(200);
  };

  return (
    <Box>
      <Box
        sx={{ display: 'flex', overflow: 'clip', height: 'calc(100vh - 20px)' }}
      >
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
                isActive={
                  displayPrimaryToolBox && activePrimaryToolIndex === index
                }
              />
            ))}
          </List>
        </Paper>
        <ToolBox
          activeIndex={activePrimaryToolIndex}
          display={displayPrimaryToolBox}
          height="100vh"
          width={primaryToolBoxWidth}
          onClose={() => setPrimaryToolBoxWidth(0)}
        >
          <FilesTool />
          <FindTool />
          <NpcsTool />
          <VariablesTool />
        </ToolBox>
        <Box
          sx={{
            width: `calc(100% - ${quickAccessWidth}px - ${primaryToolBoxWidth}px)`,
          }}
        >
          <MainBox height={`calc(100% - ${bottomToolBoxHeight}px)`}>
            <TabsContainer />
          </MainBox>
          <ToolBox
            activeIndex={activeBottomToolIndex}
            display={displayBottomToolBox}
            height={`${bottomToolBoxHeight}px`}
            width="100%"
            onClose={() => setBottomToolBoxHeight(0)}
          >
            <ConsoleTool />
          </ToolBox>
        </Box>
      </Box>
      <Paper
        sx={{
          bgcolor: (theme) => theme.palette.background.default,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          {[{ text: 'Console', icon: <TerminalIcon /> }].map((item, index) => (
            <StatusBarItem
              key={item.text}
              text={item.text}
              icon={item.icon}
              onClick={() => handleStatusBarClick(index)}
              isActive={displayBottomToolBox && activeBottomToolIndex === index}
              height="20px"
            />
          ))}
        </Box>
      </Paper>
    </Box>
  );
}
