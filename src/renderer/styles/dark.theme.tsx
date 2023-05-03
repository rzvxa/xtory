import { ThemeOptions, createTheme } from '@mui/material/styles';

const themeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#fbf1c7',
    },
    secondary: {
      main: '#fe8019',
    },
    background: {
      paper: '#3c3836',
      default: '#282828',
    },
    text: {
      primary: '#ebdbb2',
      secondary: '#fbf1c7',
      disabled: '#928374',
    },
  },
  typography: {
    fontSize: 12,
  },
};

const theme = createTheme(themeOptions);

export default theme;
