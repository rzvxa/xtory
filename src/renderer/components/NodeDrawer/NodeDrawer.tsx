import React from 'react';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import List from '@mui/material/List';
import TextField from '@mui/material/TextField';
import NodeDrawerItem from './NodeDrawerItem';

export interface NodeDrawerProps {
  items: string[];
  open: boolean;
  onClose: (event: React.MouseEvent | KeyboardEvent) => void;
  anchorPosition: { left: number; top: number } | undefined;
  onItemSelected: (string) => void;
}

export default function NodeDrawer({
  items,
  open,
  onClose,
  anchorPosition,
  onItemSelected,
}: NodeDrawerProps) {
  const [searchText, setSearchText] = React.useState<string>('');
  const [selectedNodeIndex, setSelectedNodeIndex] = React.useState<number>(0);
  const [filteredItems, setFilteredItems] = React.useState<string[]>([]);

  const onCloseHandle = React.useCallback(
    (event: React.MouseEvent | KeyboardEvent) => {
      setSearchText('');
      setSelectedNodeIndex(0);
      onClose(event);
    },
    [setSearchText, setSelectedNodeIndex, onClose]
  );

  const focusOnContextSearch = React.useCallback((input: HTMLInputElement) => {
    if (input) {
      input.blur();
      setTimeout(() => input && input.focus());
    }
  }, []);

  const clamp = (index: number, min: number, max: number) =>
    Math.min(Math.max(index, min), max);

  const handleKeyPress = React.useCallback(
    (event: React.KeyboardEvent) => {
      console.log(event)
      if (event.key === 'Enter' && selectedNodeIndex < filteredItems.length) {
        onItemSelected(filteredItems[selectedNodeIndex]);
        onCloseHandle(event);
        return;
      }
      if (event.key.startsWith('Arrow')) {
        const direction = event.key.replace('Arrow', '');
        let newIndex = selectedNodeIndex;
        if (direction === 'Up') {
          newIndex -= 1;
        } else if (direction === 'Down') {
          newIndex += 1;
        }

        if (newIndex !== selectedNodeIndex) {
          event.preventDefault();
          setSelectedNodeIndex(clamp(newIndex, 0, filteredItems.length - 1));
        }
      }
    },
    [
      filteredItems,
      setSelectedNodeIndex,
      selectedNodeIndex,
      onItemSelected,
      onCloseHandle,
    ]
  );

  // React.useEffect(() => {
  //   // attach the event listener
  //   document.addEventListener('keydown', handleKeyPress);
  //
  //   // remove the event listener
  //   return () => {
  //     document.removeEventListener('keydown', handleKeyPress);
  //   };
  // }, [handleKeyPress]);

  React.useEffect(() => {
    setFilteredItems(
      items.filter((i) => i.toLowerCase().includes(searchText.toLowerCase()))
    );
  }, [searchText, items]);

  return (
    <Popover
      open={open}
      onClose={onCloseHandle}
      anchorReference="anchorPosition"
      disableScrollLock
      anchorPosition={anchorPosition}
    >
      <Box sx={{ width: 280, maxWidth: '100%' }}>
        <List
          sx={{
            padding: 0,
            '.MuiMenuItem-root': { padding: '1px 10px 1px 10px' },
          }}
        >
          <TextField
            placeholder="Search for node..."
            autoFocus
            inputRef={focusOnContextSearch}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={handleKeyPress}
            sx={{ width: '100%', padding: 1 }}
          />
          {filteredItems.map((node, index) => (
            <NodeDrawerItem
              key={node}
              label={node}
              selected={selectedNodeIndex === index}
              onClose={(event: React.MouseEvent) => {
                onItemSelected(node);
                onCloseHandle(event);
              }}
            />
          ))}
        </List>
      </Box>
    </Popover>
  );
}
