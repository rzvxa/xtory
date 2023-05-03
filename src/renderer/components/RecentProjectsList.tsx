import React from 'react';

import { SxProps } from '@mui/system';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

interface RecentProjectsListProps {
  sx: SxProps | undefined;
}

export default function RecentProjectsList({ sx }: RecentProjectsListProps) {
  const [recentProjects] = React.useState<string[] | null>(
    null
    // Array.from({ length: 40 }, (_, k) => `Project #${k + 1}`)
  );
  return (
    <Paper
      sx={{
        ...sx,
        overflow: 'auto',
        display: 'flex',
        justifyContent: 'center',
        opacity: recentProjects || 0.2,
      }}
    >
      {recentProjects ? (
        <List sx={{ width: '100%' }}>
          {recentProjects.map((project: string) => (
            <ListItemButton>
              <ListItemText primary={project} />
            </ListItemButton>
          ))}
        </List>
      ) : (
        <Typography sx={{ alignSelf: 'center' }}>No Recent Project</Typography>
      )}
    </Paper>
  );
}
