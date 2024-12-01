import './App.css'
import Qr from "@/components/qr/qr";
import Home from './app/pages/home/home';
import Navbar from "@/components/nav/navbar";
import Search from "./app/pages/search/search";
import Profile from './app/pages/customer/profile/profile';
import { Route, Routes, useLocation  } from 'react-router-dom';
import Registration from './app/auth/registration/registration';

const App =()=> {
  const location = useLocation();
  const hideNavbarPaths = ["/register","/qrscanner"];
  const showNavbar = !hideNavbarPaths.includes(location.pathname);
  return (
    <>
     {showNavbar && <Navbar />}
      <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/qrscanner' element={<Qr/>}/>
      <Route path='/Search' element={<Search/>}/>
      <Route path='/profile' element={<Profile/>}/>
      <Route path='/register' element={<Registration/>}/>
     </Routes>
    </>
  )
}

export default App
