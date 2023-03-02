import { ThemeProvider } from '@mui/material/styles';
import './MiniDrawer';
import theme from './theme';
import MiniDrawer from './MiniDrawer';

function App() {
  return (
  <ThemeProvider theme={theme}>
    <MiniDrawer/>
  </ThemeProvider>
  );
}

export default App;
