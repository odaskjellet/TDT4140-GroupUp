import {Route, Routes} from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import {UserProvider} from './contexts/User';
import GroupPage from './pages/GroupPage';
import MyProfilePage from './pages/MyProfilePage';
import IndexPage from './pages/IndexPage';

function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<IndexPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/home" element={<HomePage/>}/>
        <Route path="/groups" element={<GroupPage/>}/>
        <Route path="/myprofile" element={<MyProfilePage/>}/>
      </Routes>
    </UserProvider>
  );
}
export default App;
