import './App.css'
import Qr from "@/components/qr/qr";
import Home from './app/pages/home/home';
import Navbar from "@/components/nav/navbar";
import Search from "./app/pages/search/search";
import Profile from './app/pages/customer/profile/profile';
import { Route, Routes, useLocation  } from 'react-router-dom';
import Registration from './app/auth/registration/registration';
import Authentication from './app/auth/authentication'
import Dashboard from './app/pages/restuarant/dashboard/dashboard';


const App =()=> {
  const location = useLocation();
  const hideNavbarPaths = ["/register","/qrscanner","/authentication","/dashboard"];
  const showNavbar = !hideNavbarPaths.includes(location.pathname);
  return (
    <>
     {showNavbar && <Navbar />}
      <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/qrscanner' element={<Qr/>}/>
      <Route path='/Search' element={<Search/>}/>
      <Route path='/profile' element={<Profile/>}/>
      <Route path='/authentication' element={<Authentication/>}/>
      <Route path='/register' element={<Registration/>}/>
      <Route path='/dashboard' element={<Dashboard/>}/>
     </Routes>
    </>
  )
}

export default App
