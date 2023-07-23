import React from 'react';

import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { LogLevel } from 'shared/types';
import { useAppDispatch, useAppSelector } from 'renderer/state/store/index';
import { setLogLevel } from 'renderer/state/store/console';

import ToolContainer from './ToolContainer';

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

  return (
    <ToolContainer
      title="Console"
      headerControls={
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
      }
    >
      <Box
        sx={{
          cursor: 'text',
          display: 'flex',
          flexDirection: 'column-reverse',
          height: '100%',
          width: '100%',
          border: 'none',
          backgroundColor: (theme) => theme.palette.background.paper,
        }}
      >
        <InputBase
          value={buffer.reduce((accum, current) => {
            if (current.level >= logLevel) {
              return `${accum}\n${current.message}`;
            } else {
              return accum;
            }
          }, '')}
          multiline
          fullWidth
        />
      </Box>
    </ToolContainer>
  );
}
