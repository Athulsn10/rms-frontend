import { FormEvent, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User, MapPin, Building } from 'lucide-react';
import "../auth.css";

interface RegistrationProps {
  onSwitchToLogin: () => void;
}

const Registration: React.FC<RegistrationProps> = ({ onSwitchToLogin }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({
    firstName: '',
    lastName: '',
    email: '',
    zipCode: '',
    password: '',
    confirmPassword: '',
    city: '',
    district: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formFields = [
    // Step 1: Personal Information
    [
      {
        id: 'firstName',
        label: 'First Name',
        type: 'text',
        placeholder: 'John',
        icon: User,
        validation: (value: string) => !value ? 'First name is required' : ''
      },
      {
        id: 'lastName',
        label: 'Last Name',
        type: 'text',
        placeholder: 'Doe',
        icon: User,
        validation: (value: string) => !value ? 'Last name is required' : ''
      },
      {
        id: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'name@example.com',
        icon: Mail,
        validation: (value: string) => {
          if (!value) return 'Email is required';
          if (!/\S+@\S+\.\S+/.test(value)) return 'Invalid email format';
          return '';
        }
      }
    ],
    // Step 2: Security Information
    [
      {
        id: 'password',
        label: 'Password',
        type: 'password',
        placeholder: '••••••••',
        icon: Lock,
        validation: (value: string) => {
          if (!value) return 'Password is required';
          if (value.length < 8) return 'Password must be at least 8 characters';
          return '';
        }
      },
      {
        id: 'confirmPassword',
        label: 'Confirm Password',
        type: 'password',
        placeholder: '••••••••',
        icon: Lock,
        validation: (value: string) => {
          if (!value) return 'Please confirm your password';
          if (value !== formData.password) return 'Passwords do not match';
          return '';
        }
      },
      {
        id: 'city',
        label: 'City',
        type: 'text',
        placeholder: 'Chelakkara',
        icon: Building,
        validation: (value: string) => !value ? 'City is required' : ''
      },
      {
        id: 'district',
        label: 'District',
        type: 'text',
        placeholder: 'Thrissur',
        icon: Building,
        validation: (value: string) => !value ? 'District is required' : ''
      },
      {
        id: 'zipCode',
        label: 'Zip Code',
        type: 'text',
        placeholder: '123456',
        icon: MapPin,
        validation: (value: string) => {
          if (!value) return 'Zip code is required';
          if (!/^\d{6}$/.test(value)) return 'Invalid zip code format';
          return '';
        }
      }
    ]
  ];

  const handleInputChange = (id: any, value: string) => {
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    if (errors[id]) {
      setErrors(prev => ({
        ...prev,
        [id]: ''
      }));
    }
  };

  const validateStep = (step: number) => {
    const currentFields = formFields[step];
    const newErrors = {} as any;
    let isValid = true;

    currentFields.forEach(field => {
      const error = field.validation(formData[field.id]);
      if (error) {
        newErrors[field.id] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      console.log('Form submitted:', formData);
    }
  };

  const currentFields = formFields[currentStep];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 p-4">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader className="space-y-1 p-4 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight">
            Create an account 👋
            <p className="text-sm mt-1">{`[ Step ${currentStep + 1} of ${formFields.length} ]`}</p>
          </CardTitle>
          <CardDescription className="text-sm">
            Enter your information to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3 custom-scroll-bar">
              {currentFields.map((field, index) => (
                <div key={index} className="space-y-2">
                  <Label htmlFor={field.id} className="text-sm">
                    {field.label}
                  </Label>
                  <div className="relative">
                    <field.icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id={field.id}
                      type={field.type}
                      placeholder={field.placeholder}
                      className="p-8 pt-0 pb-0 pr-0 w-full"
                      value={formData[field.id]}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                    />
                    {errors[field.id] && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors[field.id]}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-4 mt-6">
              {currentStep > 0 && (
                <Button
                  type="button"
                  onClick={handlePrevious}
                  className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600"
                >
                  Previous
                </Button>
              )}
              {currentStep < formFields.length - 1 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="w-full sm:w-auto bg-zinc-900"
                >
                  Next
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  className="w-full sm:w-auto bg-zinc-900"
                >
                  Create Account
                </Button>
              )}
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
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