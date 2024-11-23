import "../auth.css";
import { FormEvent, useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { handleLogIn } from '../authService';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });

  const passwordMinLength = 8;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors = { email: '', password: '' };
    let isValid = true;

    if (!email) {
      newErrors.email = 'Email is required.';
      isValid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Invalid email format.';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required.';
      isValid = false;
    } else if (password.length < passwordMinLength) {
      newErrors.password = `Password must be at least ${passwordMinLength} characters long.`;
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      handleLogIn(email, password, navigate)
    }
  };

  return (
    <>
      <div className="w-full">
        <p className="text-4xl">Login</p>
        <p className="text-xs pt-3">or <span className="text-zinc-900 hover:text-blue-700 font-medium cursor-pointer" onClick={() => navigate("/register")}>create an accoun</span>t</p>
        <div className="p-4 sm:p-6">
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className={`p-8 pt-0 pb-0 pr-0 w-full ${errors.email ? 'input-error-color' : ''}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div style={{ height: '6px', marginTop: '2px' }}>
                  {errors.email && (
                    <p className="text-red-500 text-xs">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className={`p-8 pt-0 pb-0 pr-0 w-full ${errors.password ? 'input-error-color' : ''}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div style={{ height: '6px', marginTop: '2px' }}>
                  {errors.password && (
                    <p className="text-red-500 text-xs">
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full bg-zinc-900 mt-6">
              Sign in
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;