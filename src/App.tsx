import './App.css'
import Home from './app/pages/home/home';
import Navbar from "@/components/nav/navbar";
import Search from "./app/pages/search/search";
import Authentication from './app/auth/authentication';
import { Route, Routes, useLocation  } from 'react-router-dom';

const App =()=> {
  const location = useLocation();
  const hideNavbarPaths = ["/auth","/qrscanner"];
  const showNavbar = !hideNavbarPaths.includes(location.pathname);
  return (
    <>
     {showNavbar && <Navbar />}
      <Routes>
      <Route path='/auth' element={<Authentication/>}/>
      <Route path='/' element={<Home/>}/>
      <Route path='/Search' element={<Search/>}/>
     </Routes>
    </>
  )
}

export default App
