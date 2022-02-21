import { createTheme, ThemeProvider, useMediaQuery } from '@mui/material';
import React from 'react';

export const ColorModeContext = React.createContext(
  { toggleColorMode: () => {} }
);

export const ColorModeProvider = ({children}) => {
  const [mode, setMode] = React.useState('');
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode ? mode : prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode, mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
    	  { children }
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
