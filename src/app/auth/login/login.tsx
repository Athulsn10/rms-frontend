import { FormEvent, useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { useAlert } from '@/hooks/useAlert';
import CustomAlert from '../../alert/alert';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import "../auth.css";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordMinLength = 8;

interface RegistrationProps {
  onSwitchToRegister: () => void; 
}

const Login:  React.FC<RegistrationProps> = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' }); 

  const { alert, showAlert, hideAlert } = useAlert();

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
      showAlert(newErrors.password, 'warning');
      isValid = false;
    } else if (password.length < passwordMinLength) {
      newErrors.password = `Password must be at least ${passwordMinLength} characters long.`;
      isValid = false;
    }

    setErrors(newErrors); 

    if (isValid) {
      showAlert('Login successful!', 'success');
    }
  };

  return (
    <>
      <div className="h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600">
        <Card className="w-[500px] shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">Welcome back </CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {alert.show && (
              <CustomAlert
                message={alert.message}
                type={alert.type}
                onClose={hideAlert}
                className="mb-4"
              />
            )}
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className={`p-8 pt-0 pb-0 pr-0 ${errors.email ? 'input-error-color' : ''}`} 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
               <p className="text-red-500 text-xs" style={{height:'9px'}}> {errors.email && <span>{errors.email}</span>}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className={`p-8 pt-0 pb-0 pr-0 ${errors.password ? 'input-error-color' : ''}`} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
               <p className="text-red-500 text-xs" style={{height:'9px'}}> {errors.password && <span className="text-red-500 text-xs">{errors.password}</span>} </p>
              </div>
              <Button type="submit" className="w-full bg-zinc-900">
                Sign in
              </Button>
            </form>
  
            <div className="mt-4 text-center text-sm">
              <span className="text-gray-500">Don't have an account?</span>{' '}
              <button
                onClick={onSwitchToRegister}
                className="text-zinc-900 hover:text-blue-700 font-medium"
              >
                Sign up
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Login;