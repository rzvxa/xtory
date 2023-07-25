import React from 'react';

import Box from '@mui/material/Box';

export interface ToolBoxProps {
  activeIndex: number;
  display: boolean;
  height: number | string;
  width: number | string;
  onClose: () => void;
  children: React.ReactNode;
}

export interface ToolBoxContextType {
  onClose: () => void;
}

export const ToolBoxContext = React.createContext<ToolBoxContextType | null>(
  null
);

export default function ToolBox({
  activeIndex,
  display,
  height,
  width,
  onClose,
  children,
}: ToolBoxProps) {
  const contextValue = React.useMemo(
    () => ({
      onClose,
    }),
    [onClose]
  );
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
      <ToolBoxContext.Provider value={contextValue}>
        {children}
      </ToolBoxContext.Provider>
    </Box>
  );
}
