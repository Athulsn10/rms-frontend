import './Login.css';
import Button from '../Components/button';
import { http } from '../services/http';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useNavigate()
  const handleClick = async (e: any) => {
    e.preventDefault();

    const headers = {
      'Content-Type': 'application/json',
    };

    try {
      const response = await http.post(
        '/auth/login/',
        {
          email: email,
          password: password,
        },
        { headers }
      );

      localStorage.setItem('token',response.data.data.token);
      localStorage.setItem('user',response.data.data.name);
      router('/home');
    } catch (error) {
      console.error('Error logging in', error);
    }
  };

  return (
    <div className="container-fluid vh-100 p-0">
      <div className="row h-100 g-0">
        <div className="col-md-6 d-none d-md-block">
          <div className="gradient-bg h-100"></div>
        </div>
        <div className="col-md-6 col-12 d-flex align-items-center justify-content-center">
          <div className="rounded-3 p-3 p-lg-0 p-md-0" style={{ maxWidth: '400px', width: '100%' }}>
            <h2 className="fw-bold mb-2">Welcome back 👋🏻</h2>
            <p className="text-muted mb-4">A brand new day is here. It's your day to shape. Sign in and get started.</p>
            <form>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input type="email" onChange={(e:any)=>setEmail(e.target.value)} className="form-control p-3" id="email" placeholder="Enter your email" />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" onChange={(e:any)=>setPassword(e.target.value)} className="form-control p-3" id="password" placeholder="Enter your password" />
              </div>
              <div className="mb-3">
                <Button title={'Sign In'} onClick={(e) => handleClick(e)} />
              </div>
            </form>
            <p className="text-center mb-0" style={{ fontSize: '14px' }}>
              Don't have an account? <a href="#" className="text-decoration-none">Sign Up!</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;