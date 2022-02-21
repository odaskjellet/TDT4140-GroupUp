import React from 'react';
import {Route, Routes} from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import {UserProvider} from './contexts/User';
import CreateGroupPage from './pages/CreateGroupPage';
import MyProfilePage from './pages/MyProfilePage';
import IndexPage from './pages/IndexPage';
import {ColorModeProvider} from './contexts/ColorMode';
import {CssBaseline} from '@mui/material';
import LightSwitch from './components/LightSwitch';
import GroupPage from './pages/GroupPage';

export default function App() {
  return (
    <ColorModeProvider>
      <CssBaseline enableColorScheme />
      <UserProvider>
        <Routes>
          <Route path="/" element={<IndexPage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/register" element={<RegisterPage/>}/>
          <Route path="/home" element={<HomePage/>}/>
          <Route path="/create-group" element={<CreateGroupPage/>}/>
          <Route path="/user" element={<MyProfilePage/>}/>
          <Route path="/group/:id" element={<GroupPage/>} />
        </Routes>
      </UserProvider>
      <br />
      <LightSwitch></LightSwitch>
    </ColorModeProvider>
  );
}
