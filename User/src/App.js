import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import Header from './components/Header.jsx';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  Box, 
  Typography,
  Link,
} from '@mui/material';

import useMetaMask from "./hooks/useMetamask";


function App() {

  const theme = createTheme({
    palette: {
      type: "dark",
      primary: {
        main: '#00897b',
      },
      secondary: {
        main: '#ff5722',
      },
      error: {
        main: '#ff0303',
      },
      warning: {
        main: '#ffa726',
      },
      info: {
        main: '#00838f',
      },
      divider: "#00897b",
      background: {
        default: "#121212",
        paper: "#121212",
      },
      text: {
        primary: '#fff',
        secondary: "rgba(255, 255, 255, 0.7)",
        disabled: "rgba(255, 255, 255, 0.5)"
      },
    }
  });

  const { connect, disconnect, isActive, account } = useMetaMask();

  return (
    <ThemeProvider theme={theme}> 
      <CssBaseline/>
      <Router>
        <Container sx={{display: "flex", maxHeight: "100% !important", flexDirection: "column", minWidth: "100%", padding: "0 0 0 0 !important"}}>
          <Header/>
          <Container sx={{display: "flex", height: "80vh", minWidth: "85%", flexDirection: "column"}}>
            <Routes>
              <Route path="/" element={<HomePage connect={connect} disconnect={disconnect} isActive={isActive} account={account}/>} />
              <Route path="/register" theme={theme} element={<RegisterPage connect={connect} disconnect={disconnect} isActive={isActive} account={account} />} />
              <Route path="/login" theme={theme} element={<LoginPage connect={connect} disconnect={disconnect} isActive={isActive} account={account} />} />
              <Route path="/profile" theme={theme} element={<ProfilePage connect={connect} disconnect={disconnect} isActive={isActive} account={account} />} />
            </Routes>
          </Container>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;