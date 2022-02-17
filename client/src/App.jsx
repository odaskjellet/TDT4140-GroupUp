import {Route, Routes} from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import MyProfilePage from './pages/MyProfilePage';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/home" element={<HomePage/>}/>
        <Route path="/myprofile" element={<MyProfilePage/>}/>
      </Routes>
    </div>
  );
}
export default App;
