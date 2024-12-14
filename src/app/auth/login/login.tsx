import "../auth.css";
import { FormEvent, useState } from 'react';
import { Mail, Lock, CircleAlert, Loader2 } from 'lucide-react';
import { handleLogIn } from '../authService';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import toast, { Toaster } from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });

  const passwordMinLength = 8;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const notify = (message: string, type: string) => {
    if (type) {
      (toast as any)[type](message, {
        icon: <CircleAlert  color="#fc3419"/>,
      });
    } else {
      toast(message, {
        icon: <CircleAlert color="#fc3419"/>,
      });
    }
  }

  const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const newErrors = { email: '', password: '' };
    let isValid = true;

    if (!email) {
      newErrors.email = 'Email is required.';
      isValid = false;
      setIsLoading(false);
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Invalid email format.';
      isValid = false;
      setIsLoading(false);
    }

    if (!password) {
      newErrors.password = 'Password is required.';
      isValid = false;
      setIsLoading(false);
    } else if (password.length < passwordMinLength) {
      newErrors.password = `Password must be at least ${passwordMinLength} characters long.`;
      isValid = false;
      setIsLoading(false);
    }

    setErrors(newErrors);

    if (isValid) {
      const errors = await handleLogIn(email, password, navigate);
      if (errors) {
        setIsLoading(false);
        if (errors.toLowerCase() === "user not found") {
          notify(errors, 'error');
          setTimeout(() => {
            navigate("/authentication");
          }, 2000)
        } else {
          notify(errors, 'error');
        }
      } else {
        setIsLoading(true);
      }
    }
  };

  return (
    <>
      <div className="w-full">
        <p className="text-4xl">Login</p>
        <p className="text-xs pt-3">or <span className="text-orange-600 hover:text-orange-700 font-medium cursor-pointer" onClick={() => navigate("/authentication")}>create an account</span></p>
        <div className="p-4 sm:p-6">
          <form onSubmit={handleSignIn} className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="email" className="text-sm">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-8 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className={`px-10 md:py-7 w-full rounded-none ${errors.email ? 'input-error-color' : ''}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div style={{ height: '14px', marginTop: '2px' }}>
                  {errors.email && (
                    <p className="text-red-500 text-xs">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="password" className="text-sm">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-8 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className={`px-10 md:py-7 w-full rounded-none ${errors.password ? 'input-error-color' : ''}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div style={{ height: '14px', marginTop: '2px' }}>
                  {errors.password && (
                    <p className="text-red-500 text-xs">
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <Button disabled={isLoading} type="submit" className="w-full bg-swiggyOrange p-6 hover:bg-orange-500 rounded-none">
              {
                isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <span>Login</span>
                )
              }
            </Button>
          </form>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default Login;