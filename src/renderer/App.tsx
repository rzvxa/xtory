import React from 'react';

import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import { ThemeProvider } from '@mui/material/styles';

import { Provider as ReduxProvider } from 'react-redux';

import { store, useAppSelector } from './state/store/index';

import SnackbarProvider from './components/SnackbarProvider';

import StartPage from './components/StartPage';
import Layout from './components/Layout';

import './ipc';

import darkTheme from './styles/dark.theme';
import './styles/Global.scss';

function AppView() {
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

  return projectPath ? <Layout /> : <StartPage />;
}

export default function App() {
  return (
    <ReduxProvider store={store}>
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
          <AppView />
        </SnackbarProvider>
      </ThemeProvider>
    </ReduxProvider>
  );
}
