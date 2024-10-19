import './Auth.css';
import Button from '../Components/button';
import { useState } from 'react';
import { handleSignIn } from './authService';

const Authentication = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMode, setAuthMode] = useState(true);

  const handleAuthetication = async (e: any) => {
    e.preventDefault();
    
    handleSignIn(email, password);
  };

  return (
    <div className="container-fluid vh-100 p-0">
      <div className="row h-100 g-0">
        <div className={`${authMode ? 'col-md-6 d-none d-md-block' : 'col-md-4'}`}>
          <div className="gradient-bg h-100"></div>
        </div>
        { authMode ? <div className="col-md-6 col-12 d-flex align-items-center justify-content-center">
          <div className="p-3 p-lg-0 p-md-0" style={{ maxWidth: '500px', width: '100%' }}>
            <h2 className="fw-bold mb-2">Welcome back 👋🏻</h2>
            <p className="text-muted mb-4">A brand new day is here. It's your day to shape. Sign in and get started.</p>
            <form>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input type="email" onChange={(e: any) => setEmail(e.target.value)} className="form-control p-3" id="email" placeholder="Enter your email" />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" onChange={(e: any) => setPassword(e.target.value)} className="form-control p-3" id="password" placeholder="Enter your password" />
              </div>
              <div className="mb-3">
                <Button title={'Sign In'} onClick={(e) => handleAuthetication(e)} />
              </div>
            </form>
            <p className="text-center mb-0" style={{ fontSize: '14px' }}>
              Don't have an account? <a onClick={() => setAuthMode(false)} className="text-decoration-none signup-link">Sign Up!</a>
            </p>
          </div>
        </div> :
          <div className={`${authMode ? 'col-md-6 col-12 d-flex align-items-center justify-content-center' : 'col-md-8 col-12 d-flex align-items-center justify-content-center'}`}>
            <div className="p-3 p-lg-0 p-md-0 m-5" style={{ maxWidth: '100%', width: '100%' }}>
            <h2 className="fw-bold mb-2">Hello there 👋🏻</h2>
            <p className="text-muted mb-4">A brand new day is here. It's your day to shape. Sign up and get started.</p>
            <form>
              <div className="mb-3">
                <div className='d-flex align-items-center justify-content-center gap-3'>
                  <div className='w-100'>
                    <label htmlFor="fname" className="form-label">First Name</label>
                    <input type="text" className="form-control p-3 w-100" id="fname" placeholder="Enter your first name" />
                  </div>
                  <div className='w-100'>
                    <label htmlFor="lname" className="form-label">Last Name</label>
                    <input type="text" className="form-control p-3 w-100" id="lname" placeholder="Enter your Last name" />
                  </div>
                </div>
                <div className='d-flex align-items-center justify-content-center gap-3 mt-3'>
                  <div className='w-100'>
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control p-3 w-100" id="email" placeholder="Enter your email address" />
                  </div>
                  <div className='w-100'>
                    <label htmlFor="zip" className="form-label">Zip Code</label>
                    <input type="text" className="form-control p-3 w-100" id="zip" placeholder="Enter your zip code" />
                  </div>
                </div>
                <div className='d-flex align-items-center justify-content-center gap-3 mt-3'>
                  <div className='w-100'>
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control p-3 w-100" id="password" placeholder="Enter your Password" />
                  </div>
                  <div className='w-100'>
                    <label htmlFor="confirmPass" className="form-label">Confirm Password</label>
                    <input type="password" className="form-control p-3 w-100" id="confirmPass" placeholder="Confirm your password" />
                  </div>
                </div>
                <div className='d-flex align-items-center justify-content-center gap-3 mt-3'>
                  <div className='w-100'>
                    <label htmlFor="city" className="form-label">City</label>
                    <input type="text" className="form-control p-3 w-100" id="city" placeholder="Enter your city" />
                  </div>
                  <div className='w-100'>
                    <label htmlFor="district" className="form-label">District</label>
                    <input type="text" className="form-control p-3 w-100" id="district" placeholder="Enter your District" />
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <Button title={'Sign Up'} onClick={(e) => handleAuthetication(e)} />
              </div>
            </form>
            <p className="text-center mb-0" style={{ fontSize: '14px' }}>
              Already have an account? <a onClick={() => setAuthMode(true)} className="text-decoration-none signup-link">Sign In!</a>
            </p>
          </div>
          </div>
        }
      </div>
    </div>
  );
};

export default Authentication;