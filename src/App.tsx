import './App.css';
import Qr from "@/components/qr/qr";
import Home from './app/pages/home/home';
import Navbar from "@/components/nav/navbar";
import Search from "./app/pages/search/search";
import Profile from './app/pages/customer/profile/profile';
import { Route, Routes, useLocation } from 'react-router-dom';
import Registration from './app/auth/registration/registration';
import Authentication from './app/auth/authentication';
import Dashboard from './app/pages/restuarant/dashboard/dashboard';
import Protected from './app/auth/protect/protected';
import { AppProvider } from './app/context/provider';

const App = () => {
  const location = useLocation();
  const hideNavbarPaths = ["/register", "/qrscanner", "/authentication", "/dashboard"];
  const showNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <AppProvider>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Protected><Home /></Protected>} />
        <Route path="/qrscanner" element={<Protected><Qr /></Protected>} />
        <Route path="/search" element={<Protected><Search /></Protected>} />
        <Route path="/profile" element={<Protected><Profile /></Protected>} />
        <Route path="/authentication" element={<Protected><Authentication /></Protected>} />
        <Route path="/register" element={<Protected><Registration /></Protected>} />
        <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
      </Routes>
    </AppProvider>
  );
};

export default App;
