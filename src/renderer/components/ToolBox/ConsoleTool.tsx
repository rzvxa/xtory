import React from 'react';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import { LogLevel, LogMessage } from 'shared/types';
import { useAppDispatch, useAppSelector } from 'renderer/state/store/index';
import { setLogLevel, clearLogs } from 'renderer/state/store/console';
import useGuid from 'renderer/hooks/useGuid';

import ToolContainer from './ToolContainer';

const Inline = styled(Box)(() => ({ display: 'inline' }));

const logColorTags = [
  '#928374', // trace
  '#afa88b', // debug
  '#83a598', // info
  '#fabd2f', // warning
  '#fb4934', // error
  '#cc241d', // fatal
];

function LogView({ log }: { log: LogMessage }) {
  return (
    <Box sx={{ color: (theme) => theme.palette.text.disabled }}>
      <Inline sx={{ fontWeight: 600 }}>[{log.date}]</Inline>{' '}
      <Inline sx={{ fontWeight: 400, color: logColorTags[log.level] }}>
        [{LogLevel[log.level]}]
      </Inline>
      : {log.message}
    </Box>
  );
}

export default function ConsoleTool() {
  const dispatch = useAppDispatch();

  const { buffer, logLevel } = useAppSelector((state) => state.consoleState);

  const handleLogLevelChange = React.useCallback(
    (event: SelectChangeEvent) => {
      const level = event.target.value as unknown as LogLevel;
      dispatch(setLogLevel(level));
    },
    [dispatch]
  );

  const handleClearConsoleClick = React.useCallback(
    () => dispatch(clearLogs()),
    [dispatch]
  );

  return (
    <ToolContainer
      title="Console"
      headerControls={
        <>
          <Tooltip title="Log Level" placement="top" arrow>
            <FormControl fullWidth>
              <Select
                value={logLevel as unknown as string}
                sx={{
                  width: '100px',
                }}
                onChange={handleLogLevelChange}
                size="small"
              >
                {Object.keys(LogLevel)
                  .filter((key) => Number.isNaN(+key))
                  .map((key: string) => {
                    return (
                      <MenuItem
                        key={key}
                        value={LogLevel[key as unknown as LogLevel]}
                      >
                        {key}
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>
          </Tooltip>
          <Tooltip title="Clear Console" placement="top" arrow>
            <IconButton
              aria-label="clear-console"
              sx={{ padding: 0, borderRadius: 0, ml: 2, pl: 1, pr: 1 }}
              onClick={handleClearConsoleClick}
            >
              <DeleteForeverIcon />
            </IconButton>
          </Tooltip>
        </>
      }
    >
      <Box
        sx={{
          userSelect: 'text',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: '100%',
          border: 'none',
          padding: 1,
          backgroundColor: (theme) => theme.palette.background.paper,
          overflowY: 'scroll',
        }}
      >
        {buffer
          .filter((log) => log.level >= logLevel)
          .map((log) => {
            return <LogView key={log.id} log={log} />;
          })}
      </Box>
    </ToolContainer>
  );
}
