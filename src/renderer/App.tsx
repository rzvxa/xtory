import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { Provider as ReduxProvider } from 'react-redux';
import Layout from './components/Layout';

import { store } from './state/store/index';

import darkTheme from './styles/dark.theme';
import './styles/Global.scss';

export default function App() {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Layout />
      </ThemeProvider>
    </ReduxProvider>
  );
}
