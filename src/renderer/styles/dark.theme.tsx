import { ThemeOptions, createTheme } from '@mui/material/styles';

export const themeOptions: ThemeOptions = {
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
    error: {
      main: '#fb4934',
      dark: '#cc241d',
    },
    warning: {
      main: '#fabd2f',
      dark: '#d79921',
    },
    info: {
      main: '#83a598',
      dark: '#458588',
    },
    success: {
      main: '#b8bb26',
      dark: '#98971a',
    },
  },
  typography: {
    fontSize: 12,
  },
};

const theme = createTheme(themeOptions);

export default theme;
