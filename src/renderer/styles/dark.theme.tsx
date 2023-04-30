import { ThemeOptions, createTheme } from '@mui/material/styles';

const themeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#ebdbb2',
    },
    secondary: {
      main: '#fe8019',
    },
    background: {
      paper: '#3c3836',
      default: '#282828',
    },
  },
};

const theme = createTheme(themeOptions);

export default theme;