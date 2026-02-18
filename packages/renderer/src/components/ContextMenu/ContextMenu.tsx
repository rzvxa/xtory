import React from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuList from '@mui/material/MenuList';

type menuVariants = 'menu' | 'selectedMenu';

export interface ContextMenuProps {
  open: boolean;
  onClose: (event: React.MouseEvent | React.KeyboardEvent) => void;
  anchorPosition: { left: number; top: number } | undefined;
  variant?: menuVariants | undefined;
  children: React.ReactNode;
}

export default function ContextMenu({
  open,
  onClose,
  anchorPosition,
  variant = undefined,
  children,
}: ContextMenuProps) {
  return (
    <Menu
      open={open}
      onClose={onClose}
      anchorReference="anchorPosition"
      disableScrollLock
      anchorPosition={anchorPosition}
      variant={variant}
    >
      <Box sx={{ width: 280, maxWidth: '100%' }}>
        <MenuList
          sx={{
            padding: 0,
            '.MuiMenuItem-root': { padding: '1px 10px 1px 10px' },
          }}
        >
          {React.Children.map<React.ReactNode, React.ReactNode>(
            children,
            (child: React.ReactNode) => {
              if (React.isValidElement(child)) {
                return React.cloneElement(child as React.ReactElement, {
                  onClose: child.props.onClose
                    ? (e: React.MouseEvent) => {
                        child.props.onClose();
                        onClose(e);
                      }
                    : onClose,
                });
              }
              return null;
            }
          )}
        </MenuList>
      </Box>
    </Menu>
  );
}
