import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import SnackbarProvider from './components/SnackbarProvider';

import StartPage from './components/StartPage';
import Layout from './components/Layout';

import { useAppSelector } from './state/store/index';

import './ipc.ts';

import darkTheme from './styles/dark.theme';
import './styles/Global.scss';

export default function App() {
  const projectPath = useAppSelector((state) => state.projectState.projectPath);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <SnackbarProvider>
        {projectPath ? <Layout /> : <StartPage />}
      </SnackbarProvider>
    </ThemeProvider>
  );
}
