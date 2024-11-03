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

const Registration:  React.FC<RegistrationProps> = ({ onSwitchToLogin }) => {
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
        validation: (value:string) => !value ? 'First name is required' : ''
      },
      {
        id: 'lastName',
        label: 'Last Name',
        type: 'text',
        placeholder: 'Doe',
        icon: User,
        validation: (value:string) => !value ? 'Last name is required' : ''
      },
      {
        id: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'name@example.com',
        icon: Mail,
        validation: (value:string) => {
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
        validation: (value:string) => {
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
        validation: (value:string) => {
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
        validation: (value:string) => !value ? 'City is required' : ''
      },
      {
        id: 'district',
        label: 'District',
        type: 'text',
        placeholder: 'Thrissur',
        icon: Building,
        validation: (value:string) => !value ? 'District is required' : ''
      },
      {
        id: 'zipCode',
        label: 'Zip Code',
        type: 'text',
        placeholder: '123456',
        icon: MapPin,
        validation: (value:string) => {
          if (!value) return 'Zip code is required';
          if (!/^\d{6}$/.test(value)) return 'Invalid zip code format';
          return '';
        }
      }
    ]
  ];

  const handleInputChange = (id:any, value:string) => {
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    // Clear error when user starts typing
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

  const handleNext = () => {
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
      // Your sign up logic here
      console.log('Form submitted:', formData);
    }
  };

  const currentFields = formFields[currentStep];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 py-12">
      <Card className="w-[550px] h-[560px] shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Create an account 👋<br /> <p className='text-sm'>{`[ Step ${currentStep + 1} of ${formFields.length} ]`}</p>
          </CardTitle>
          <CardDescription>
            Enter your information to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="h-[300px] overflow-y-scroll custom-scroll-bar">
              {currentFields.map((field, index) => (
                <div key={index} className="space-y-2">
                  <Label htmlFor={field.id}>{field.label}</Label>
                  <div className="relative">
                    <field.icon className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <Input
                      id={field.id}
                      type={field.type}
                      placeholder={field.placeholder}
                      className="p-8 pt-0 pb-0 pr-0 w-[480px] ml-1"
                      value={formData[field.id]}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                    />
                    <p className="text-red-500 text-xs" style={{ height: '5px' }}>{errors[field.id] && (
                      <span className="text-red-500 text-sm">{errors[field.id]}</span>
                    )}</p>

                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between space-x-4 mt-6">
              {currentStep > 0 && (
                <Button
                  type="button"
                  onClick={handlePrevious}
                  className="bg-gray-500 hover:bg-gray-600"
                >
                  Previous
                </Button>
              )}
              {currentStep < formFields.length - 1 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="bg-zinc-900 ml-auto"
                >
                  Next
                </Button>
              ) : (
                <Button type="submit" className="bg-zinc-900 ml-auto">
                  Create Account
                </Button>
              )}
            </div>
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