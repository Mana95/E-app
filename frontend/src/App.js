import './App.css';
import Login from './components/Login';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import SignUp from './components/SignUp';
import ViewUser from './components/View-users';
import RequireAuth from './components/RequireAuth';
import Unauthorized from './components/Unautheorized';
import MyInfo from './components/MyInfo';
const ROLES = {
  'User': 'user',
  'Editor': 1984,
  'Admin': 'admin'
}

const App =()=>{
  return (
    <Routes>
      <Route path="/" element = {<Layout/>}>
        <Route path="login" element={<Login/>} />
        <Route path="register" element={<SignUp/>} />
        <Route path="unauthorized" element={<Unauthorized />} />
        {/* Protected routes */}
        <Route element={<RequireAuth allowedRoles={[ROLES.Admin,ROLES.User]} />}>
        <Route path="view" element={<ViewUser/>} />
        </Route>

        <Route element={<RequireAuth allowedRoles={[ROLES.User , ROLES.Admin]} />}>
        <Route path="myinfo/:id" element={<MyInfo/>} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
