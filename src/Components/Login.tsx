import './Login.css';

const Login = () => {
  return (
    <div className="container-fluid vh-100 p-0">
      <div className="row h-100 g-0">
        <div className="col-md-6 d-none d-md-block">
          <div className="gradient-bg h-100"></div>
        </div>
        <div className="col-md-6 col-12 d-flex align-items-center justify-content-center">
          <div className="bg-light rounded-3 p-3 p-lg-0 p-md-0" style={{ maxWidth: '400px', width: '100%' }}>
            <h2 className="fw-bold mb-2">Welcome back 👋🏻</h2>
            <p className="text-muted mb-4">A brand new day is here. It's your day to shape. Sign in and get started.</p>
            <form>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input type="email" className="form-control p-3" id="email" placeholder="Enter your email" />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" className="form-control p-3" id="password" placeholder="Enter your password" />
              </div>
              <div className="mb-3">
                <button type="submit" className="btn w-100 login-button p-2">LOGIN</button>
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