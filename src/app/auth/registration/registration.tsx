import "../auth.css";
import { cn } from "@/lib/utils"
import { FormEvent, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { handleRegister } from '../authService';
import { format as dateFnsFormat } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Mail, Lock, User, MapPin, Building, Home, NutOff, Phone, Cake } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


interface AddressData {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  phone: string,
  dob: string,
  address: AddressData;
  allergies: string[];
}

const Registration = () => {
  const navigate = useNavigate();
  const [confirmPassword, setConfirmPassword] = useState('')
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    phone: '',
    dob: '',
    address: {
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      country: '',
      pincode: '',
    },
    allergies: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const commonAllergies = [
    "Peanuts",
    "Tree Nuts",
    "Milk",
    "Egg",
    "Wheat",
    "Soy",
    "Fish",
    "Shellfish",
    "Sesame",
    "Mustard",
    "Celery",
    "Lupin",
    "Sulphites",
    "Gluten",
    "Lactose",
  ];

  const formFields = [
    // Step 1: Personal Information
    [
      {
        id: 'name',
        label: 'Full Name',
        type: 'text',
        placeholder: 'John Doe',
        icon: User,
        validation: (value: string) => !value ? 'Full name is required' : ''
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
      },
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
        validation: () => {
          if (!confirmPassword) return 'Please confirm your password';
          if (confirmPassword !== formData.password) return 'Passwords do not match';
          return '';
        }
      },
      {
        id: 'phone',
        label: 'Phone',
        type: 'text',
        placeholder: '87333021863',
        icon: Phone,
        validation: (value: string) => {
          if (!value) return 'Phone number is required';
          if (!/^\d{10}$/.test(value)) return 'Phone number must be exactly 10 digits';
          return '';
        }
      },
      {
        id: 'dob',
        label: 'Date Of Birth',
        type: 'date',
        placeholder: '17-05-2002',
        icon: Cake,
        validation: () => { }
      }
    ],
    // Step 3: Address Information
    [
      {
        id: 'address.addressLine1',
        label: 'Address Line 1',
        type: 'text',
        placeholder: 'Street address',
        icon: Home,
        validation: (value: string) => !value ? 'Address line 2 is required' : ''
      },
      {
        id: 'address.addressLine2',
        label: 'Address Line 2',
        type: 'text',
        placeholder: 'Apartment, suite, etc. (optional)',
        icon: Home,
        validation: (value: string) => !value ? 'Address line 2 is required' : ''
      },
      {
        id: 'address.city',
        label: 'City',
        type: 'text',
        placeholder: 'City',
        icon: Building,
        validation: (value: string) => !value ? 'City is required' : ''
      },
      {
        id: 'address.state',
        label: 'State',
        type: 'text',
        placeholder: 'State',
        icon: Building,
        validation: (value: string) => !value ? 'State is required' : ''
      },
      {
        id: 'address.country',
        label: 'Country',
        type: 'text',
        placeholder: 'Country',
        icon: Building,
        validation: (value: string) => !value ? 'Country is required' : ''
      },
      {
        id: 'address.pincode',
        label: 'PIN Code',
        type: 'text',
        placeholder: '123456',
        icon: MapPin,
        validation: (value: string) => {
          if (!value) return 'PIN code is required';
          if (!/^\d{6}$/.test(value)) return 'Invalid PIN code format';
          return '';
        }
      }
    ],
    // Step 4: Allergies
    [
      {
        id: 'allergies',
        label: 'Allergies',
        type: 'text',
        placeholder: 'Add allergies',
        icon: NutOff,
        validation: () => ''
      }
    ]
  ];

  const handleInputChange = (id: string, value: string) => {
    setFormData(prev => {
      if (id.startsWith('address.')) {
        const addressField = id.split('.')[1];
        return {
          ...prev,
          address: {
            ...prev.address,
            [addressField]: value
          }
        };
      }
      if (id === "confirmPassword") {
        setConfirmPassword(value);
        return prev;
      }
      return {
        ...prev,
        [id]: value
      };
    });

    if (errors[id]) {
      setErrors(prev => ({
        ...prev,
        [id]: ''
      }));
    }
  };

  const handleAllergyToggle = (allergy: string) => {
    setFormData(prev => {
      const updatedAllergies = prev.allergies.includes(allergy)
        ? prev.allergies.filter(a => a !== allergy)
        : [...prev.allergies, allergy];

      return {
        ...prev,
        allergies: updatedAllergies
      };
    });
  };

  const validateStep = (step: number) => {
    const currentFields = formFields[step];
    const newErrors = {} as Record<string, string>;
    let isValid = true;

    currentFields.forEach(field => {
      const value = field.id.includes('.')
        ? formData.address[field.id.split('.')[1] as keyof AddressData]
        : formData[field.id as keyof FormData];
      if (field.id === "confirmPassword") {
        console.log(field.validation(value as string))
      }
      const error = field.validation(value as string);
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
      handleRegister(formData, navigate);
    }
  };

  const currentFields = formFields[currentStep];

  const renderAllergiesStep = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <NutOff className="h-5 w-5 text-gray-500" />
        <p className="text-lg font-medium">Select Your Allergies</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {commonAllergies.map((allergy) => (
          <div key={allergy} className="flex items-center space-x-2">
            <Checkbox
              id={allergy}
              checked={formData.allergies.includes(allergy)}
              onCheckedChange={() => handleAllergyToggle(allergy)}
            />
            <Label
              htmlFor={allergy}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {allergy}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 p-4">
      <Card className="w-full max-w-5xl shadow-xl">
        <CardHeader className="space-y-1 p-6 sm:p-8">
          <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight">
            Create an account 👋
            <p className="text-sm mt-2">{`[ Step ${currentStep + 1} of ${formFields.length} ]`}</p>
          </CardTitle>
          <CardDescription className="text-sm">
            Enter your information to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className={`${currentFields.some(field => field.id === "allergies") ? "" : "grid grid-cols-1 md:grid-cols-2"} gap-2`}>
              {currentFields.map((field, index) => {
                if (field.id === "allergies") {
                  return renderAllergiesStep();
                }

                return (
                  <div key={index} className="space-y-2">
                    <Label htmlFor={field.id} className="text-sm font-medium block">
                      {field.label}
                    </Label>
                    {field.type === "date" ? (
                      <>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-100 justify-start text-left py-4 font-normal",
                                !formData[field.id as keyof FormData] && "text-muted-foreground"
                              )}
                            >
                              <Cake className="mr-2 h-4 w-4" />
                              {formData[field.id as keyof FormData] ?
                                dateFnsFormat(new Date(formData[field.id as keyof FormData] as string), "PPP") :
                                <span>Pick Your Date Of Birth</span>
                              }
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={formData[field.id as keyof FormData] ?
                                new Date(formData[field.id as keyof FormData] as string) :
                                undefined}
                              onSelect={(date) => {
                                if (date) {
                                  handleInputChange(field.id, date.toISOString().split('T')[0]);
                                }
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <div style={{ height: '6px', marginTop: '2px', display: 'flex', justifyContent: 'end', width: '100%' }}>
                          {errors[field.id] && (
                            <p className="text-red-500 text-xs">
                              {errors[field.id]}
                            </p>
                          )}
                        </div>
                      </>

                    ) :
                      (
                        <div className="relative">
                          <field.icon className="absolute left-3 top-6 -translate-y-1/2 h-5 w-5 text-gray-500" />
                          <Input
                            id={field.id}
                            type={field.type}
                            placeholder={field.placeholder}
                            className="p-10 pt-0 pb-0 pr-0 h-12 w-full bg-white"
                            value={ (field.id.includes('.') ? formData.address[field.id.split('.')[1] as keyof AddressData]: formData[field.id as keyof FormData]) as any }
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                          />
                          <div style={{ height: '6px', marginTop: '2px', display: 'flex', justifyContent: 'end', width: '100%' }}>
                            {errors[field.id] && (
                              <p className="text-red-500 text-xs">
                                {errors[field.id]}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-8 border-t pt-6">
              {currentStep > 0 && (
                <Button
                  type="button"
                  onClick={handlePrevious}
                  className="w-full sm:w-32 bg-gray-500 hover:bg-gray-600"
                >
                  Previous
                </Button>
              )}
              {currentStep < formFields.length - 1 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="w-full sm:w-32 bg-zinc-900"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="w-full sm:w-48 bg-zinc-900"
                >
                  Create Account
                </Button>
              )}
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-500">Already have an account?</span>{' '}
            <button
              onClick={()=> navigate('/')}
              className="text-zinc-900 hover:text-blue-700 font-medium"
            >
             Back to home
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Registration;