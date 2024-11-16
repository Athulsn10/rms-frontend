import { useState } from 'react';
import Login from './login/login';
import Registration from './registration/registration';

const Authentication = () => {
  const [isLogin, setIsLogin] = useState(true);

  const handleSwitchToRegister = () => setIsLogin(false);
  const handleSwitchToLogin = () => setIsLogin(true);

  return isLogin ? (
    <Login onSwitchToRegister={handleSwitchToRegister} />
  ) : (
    <Registration onSwitchToLogin={handleSwitchToLogin} />
  );
};

export default Authentication;