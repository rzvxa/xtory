import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import { ThemeProvider } from '@mui/material/styles';
import SnackbarProvider from './components/SnackbarProvider';

import StartPage from './components/StartPage';
import Layout from './components/Layout';

import { useAppSelector } from './state/store/index';

import './ipc';

import darkTheme from './styles/dark.theme';
import './styles/Global.scss';

export default function App() {
  const projectPath = useAppSelector((state) => state.projectState.projectPath);
  React.useEffect(() => {
    const handleAuxClick = (event: MouseEvent) => {
      if (event.button === 1) {
        event.preventDefault();
      }
    };

    document.addEventListener('mousedown', handleAuxClick);
    return () => {
      document.removeEventListener('mousedown', handleAuxClick);
    };
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <GlobalStyles
        styles={(theme) => ({
          '::selection': {
            background: theme.palette.primary.main,
            color: theme.palette.background.paper,
          },
        })}
      />
      <CssBaseline />
      <SnackbarProvider>
        {projectPath ? <Layout /> : <StartPage />}
      </SnackbarProvider>
    </ThemeProvider>
  );
}
