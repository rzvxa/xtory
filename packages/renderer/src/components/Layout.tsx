import React from 'react';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';

import SnippetFolderIcon from '@mui/icons-material/SnippetFolder';
import SearchIcon from '@mui/icons-material/Search';
import GroupIcon from '@mui/icons-material/Group';
import DataObjectIcon from '@mui/icons-material/DataObject';
import TerminalIcon from '@mui/icons-material/Terminal';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExtensionIcon from '@mui/icons-material/Extension';

import { useAppSelector } from 'renderer/state/store';

import TabsContainer from './Tab/TabsContainer';
import ResizeHandle from './ResizeHandle';
import {
  ToolBox,
  FilesTool,
  FindTool,
  CharactersTool,
  VariablesTool,
  ConsoleTool,
  PluginsTool,
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

  // Resize constraints
  const MIN_PRIMARY_WIDTH = 200;
  const MAX_PRIMARY_WIDTH = 800;
  const MIN_BOTTOM_HEIGHT = 100;
  const MAX_BOTTOM_HEIGHT = 600;

  // Load saved sizes from localStorage or use defaults
  const getInitialPrimaryWidth = () => {
    const saved = localStorage.getItem('primaryToolBoxWidth');
    if (saved) {
      const parsed = parseInt(saved, 10);
      return Math.max(MIN_PRIMARY_WIDTH, Math.min(MAX_PRIMARY_WIDTH, parsed));
    }
    return 300;
  };

  const getInitialBottomHeight = () => {
    const saved = localStorage.getItem('bottomToolBoxHeight');
    if (saved) {
      const parsed = parseInt(saved, 10);
      return Math.max(MIN_BOTTOM_HEIGHT, Math.min(MAX_BOTTOM_HEIGHT, parsed));
    }
    return 200;
  };

  const [primaryToolBoxWidth, setPrimaryToolBoxWidth] = React.useState<number>(
    getInitialPrimaryWidth
  );
  const [bottomToolBoxHeight, setBottomToolBoxHeight] = React.useState<number>(
    getInitialBottomHeight
  );
  const [activePrimaryToolIndex, setActivePrimaryToolIndex] = React.useState(0);
  const [activeBottomToolIndex, setActiveBottomToolIndex] = React.useState(0);

  const pluginsState = useAppSelector((state) => state.pluginsState);

  const displayPrimaryToolBox = primaryToolBoxWidth > 0;
  const displayBottomToolBox = bottomToolBoxHeight > 0;

  // Persist sizes to localStorage
  React.useEffect(() => {
    if (primaryToolBoxWidth > 0) {
      localStorage.setItem(
        'primaryToolBoxWidth',
        primaryToolBoxWidth.toString()
      );
    }
  }, [primaryToolBoxWidth]);

  React.useEffect(() => {
    if (bottomToolBoxHeight > 0) {
      localStorage.setItem(
        'bottomToolBoxHeight',
        bottomToolBoxHeight.toString()
      );
    }
  }, [bottomToolBoxHeight]);

  const handlePrimaryToolBoxResize = (delta: number) => {
    setPrimaryToolBoxWidth((prev) => {
      const newWidth = prev + delta;
      return Math.max(MIN_PRIMARY_WIDTH, Math.min(MAX_PRIMARY_WIDTH, newWidth));
    });
  };

  const handleBottomToolBoxResize = (delta: number) => {
    setBottomToolBoxHeight((prev) => {
      const newHeight = prev - delta; // Subtract because dragging down increases height
      return Math.max(
        MIN_BOTTOM_HEIGHT,
        Math.min(MAX_BOTTOM_HEIGHT, newHeight)
      );
    });
  };

  const handleQuickAccessClick = (index: number) => {
    if (index === activePrimaryToolIndex) {
      setPrimaryToolBoxWidth(
        primaryToolBoxWidth > 0 ? 0 : getInitialPrimaryWidth()
      );
      return;
    }
    setActivePrimaryToolIndex(index);
    setPrimaryToolBoxWidth(getInitialPrimaryWidth());
  };

  const handleStatusBarClick = (index: number) => {
    if (index === activeBottomToolIndex) {
      setBottomToolBoxHeight(
        bottomToolBoxHeight > 0 ? 0 : getInitialBottomHeight()
      );
      return;
    }
    setActiveBottomToolIndex(index);
    setBottomToolBoxHeight(getInitialBottomHeight());
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
              { text: 'Characters', icon: <GroupIcon /> },
              { text: 'Variables', icon: <DataObjectIcon /> },
              { text: 'Plugins', icon: <ExtensionIcon /> },
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
          <CharactersTool />
          <VariablesTool />
          <PluginsTool />
        </ToolBox>
        {displayPrimaryToolBox && (
          <ResizeHandle
            direction="horizontal"
            onResize={handlePrimaryToolBoxResize}
          />
        )}
        <Box
          sx={{
            width: `calc(100% - ${quickAccessWidth}px - ${primaryToolBoxWidth}px)`,
          }}
        >
          <MainBox height={`calc(100% - ${bottomToolBoxHeight}px)`}>
            <TabsContainer />
          </MainBox>
          {displayBottomToolBox && (
            <ResizeHandle
              direction="vertical"
              onResize={handleBottomToolBoxResize}
            />
          )}
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
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            {[{ text: 'Console', icon: <TerminalIcon /> }].map(
              (item, index) => (
                <StatusBarItem
                  key={item.text}
                  text={item.text}
                  icon={item.icon}
                  onClick={() => handleStatusBarClick(index)}
                  isActive={
                    displayBottomToolBox && activeBottomToolIndex === index
                  }
                  height="20px"
                />
              )
            )}
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              paddingRight: 1,
              height: '20px',
            }}
          >
            {pluginsState.isLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={12} />
                <Typography variant="caption">
                  {pluginsState.loadingMessage}
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CheckCircleIcon sx={{ fontSize: 14, color: 'success.main' }} />
                <Typography variant="caption">
                  {pluginsState.pluginCount > 0
                    ? `${pluginsState.pluginCount} plugin${
                        pluginsState.pluginCount !== 1 ? 's' : ''
                      } loaded in ${(pluginsState.loadTime / 1000).toFixed(1)}s`
                    : 'Plugins Ready'}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
