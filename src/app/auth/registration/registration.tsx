import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User, MapPin, Building } from 'lucide-react';

const Registration = ({ onSwitchToLogin }) => {
  const handleSignUp = async (e: Event) => {
    e.preventDefault();
    // Your sign up logic here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 py-12">
      <Card className="w-[80%] py-3 px-5 shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">Create an account 👋</CardTitle>
          <CardDescription>
            Enter your information to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-500"/>
                  <Input id="firstName" placeholder="John" className="p-8 pt-0 pb-0 pr-0" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input id="lastName" placeholder="Doe" className="p-8 pt-0 pb-0 pr-0" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input id="email" type="email" placeholder="name@example.com" className="p-8 pt-0 pb-0 pr-0" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">Zip Code</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input id="zipCode" placeholder="12345" className="p-8 pt-0 pb-0 pr-0" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input id="password" type="password" placeholder="••••••••" className="p-8 pt-0 pb-0 pr-0" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input id="confirmPassword" type="password" placeholder="••••••••" className="p-8 pt-0 pb-0 pr-0" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input id="city" placeholder="New York" className="p-8 pt-0 pb-0 pr-0" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input id="district" placeholder="Manhattan" className="p-8 pt-0 pb-0 pr-0" />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full bg-zinc-900">
              Create Account
            </Button>
          </form>
          
          <div className="mt-4 text-center text-sm">
            <span className="text-gray-500">Already have an account?</span>{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-zinc-900 hover:text-blue-700 font-medium"
            >
              Sign in
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Registration;