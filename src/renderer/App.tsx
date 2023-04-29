import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import Layout from './components/Layout';

import darkTheme from './styles/dark.theme';
import './styles/Global.scss';

export default function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Layout />
    </ThemeProvider>
  );
}
