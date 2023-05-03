import React from 'react';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { useAppDispatch, useAppSelector } from 'renderer/state/store/index';

import { setProjectPath } from 'renderer/state/store/project';

import RecentProjectsList from './RecentProjectsList';
import { NewProjectModal, NewProjectModel } from './NewProjectModal';

import 'renderer/styles/fonts/Damion.module.scss';

const ActionButton = styled(Button)({
  width: '300px',
  marginTop: '10px',
});

export default function StartPage() {
  const dispatch = useAppDispatch();

  const [newProjectModalOpen, setNewProjectModalOpen] =
    React.useState<boolean>(false);

  const openProject = (path: string) => {
    dispatch(setProjectPath(path));
  };

  const onNewProjectButtonClick = () => {
    setNewProjectModalOpen(true);
  };

  const onNewProjectModalClose = (result: NewProjectModel) => {
    if (result === null) {
      setNewProjectModalOpen(false);
      return;
    }
    openProject('Path');
    console.log(result, 'result');
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          height: '100vh',
          flexDirection: 'column',
          justifyContet: 'center',
          alignItems: 'center',
          padding: 2,
        }}
      >
        <Typography
          sx={{ fontFamily: 'Damion' }}
          variant="h1"
          fontSize={150}
          mb={4}
        >
          XTory
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '300px',
            alignItems: 'center',
            '> *': { marginTop: 1 },
          }}
        >
          <Typography variant="h6">Non-Linear Story Writing Tool</Typography>
          <ActionButton variant="contained" onClick={onNewProjectButtonClick}>
            New Project
          </ActionButton>
          <ActionButton variant="contained" onClick={() => openProject('Path')}>
            Open Project
          </ActionButton>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              marginTop: 4,
            }}
          >
            <Typography variant="h6" sx={{ alignSelf: 'start' }}>
              Recent
            </Typography>
            <RecentProjectsList sx={{ height: '200px' }} />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', width: '100%' }} mt="auto" mr="auto">
          <Typography variant="caption">Version: 0.3pre-alpha</Typography>
          <Link
            target="_blank"
            href="https://github.com/rzvxa/xtory"
            ml="auto"
            variant="caption"
          >
            Visit Github page
          </Link>
        </Box>
      </Box>
      <NewProjectModal
        open={newProjectModalOpen}
        onClose={onNewProjectModalClose}
      />
    </>
  );
}
