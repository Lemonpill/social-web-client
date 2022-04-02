import React, { createContext, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthContextProvider } from "./context/useAuthContext";
import { ModalContextProvider } from "./context/useModalContext";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

export const ColorModeContext = createContext({toggleColorMode: () => {}})

function ToggleColorMode({children}) {

  const [mode, setMode] = useState(
    localStorage.getItem("colorMode") ? 
    // set color mode from localstorage
    localStorage.getItem("colorMode") : 
    // if none, use "dark" as default
    "dark"
    )
    
    const colorMode = useMemo(() => ({
      toggleColorMode: () => {
        setMode(prevMode => (prevMode === "light" ? "dark" : "light"))
      }
    }), [])
    
    // Update local storage on color mode change
    React.useEffect(() => {
      localStorage.setItem("colorMode", mode)
    }, [mode])

    const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: {
        main: "#F42272"
      },
      good: "#8bc34a",
      background: {
        default: mode === "light" ? "#ededed" : "#000",
        paper: mode === "light" ? "#fff" : "#121212",
        navbar: mode === "light" ? "#fff" : "#111111"
      }
    },
    shape: {
      borderRadius: 8,
    },
    typography: {
      fontWeightRegular: 300,
      fontWeightMedium: 400,
      allVariants: {
        lineHeight: "150%"
      },
    }
  }), [mode])

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <AuthContextProvider
      localBearer={localStorage.getItem("bearerToken")}
      localBearerExp={localStorage.getItem("bearerTokenExp")}
      localRefresh={localStorage.getItem("refreshToken")}
      localRefreshExp={localStorage.getItem("refeshTokenExp")}
      >
      <ModalContextProvider>
        <ToggleColorMode>
          <CssBaseline/>
          <App />
        </ToggleColorMode>
      </ModalContextProvider>
    </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// https://bit.ly/CRA-vitals
reportWebVitals();
