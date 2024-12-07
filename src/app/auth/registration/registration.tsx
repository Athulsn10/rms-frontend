import "../auth.css";
import { FormEvent, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { handleRegister } from '../authService';
import { useSearchParams } from 'react-router-dom';
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Lock, User, MapPin, Building, Home, NutOff, Phone, Cake, BadgeIndianRupee, ArrowRight, ArrowLeft } from 'lucide-react';


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
  const [searchParams] = useSearchParams();
  const registrationType = searchParams.get('type');
  const [currentStep, setCurrentStep] = useState(0);
  const [confirmPassword, setConfirmPassword] = useState('')
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
        required: true,
        registrationType:['customer','restaurant'],
        validation: (value: string) => !value ? 'Full name is required' : ''
      },
      {
        id: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'name@example.com',
        icon: Mail,
        required: true,
        registrationType:['customer','restaurant'],
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
        required: true,
        registrationType:['customer','restaurant'],
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
        required: true,
        registrationType:['customer','restaurant'],
        validation: () => {
          if (!confirmPassword) return 'Please confirm your password';
          if (confirmPassword !== formData.password) return 'Passwords do not match';
          return '';
        }
      },
      {
        id: 'phone',
        label: 'Phone',
        type: 'tel',
        placeholder: '87333021863',
        icon: Phone,
        required: true,
        registrationType:['customer','restaurant'],
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
        required: true,
        placeholder: '17-05-2002',
        icon: Cake,
        registrationType:['customer'],
        validation: (value: string) => {
          if (!value) return 'Date of birth is required';
         }
      },
      {
        id: 'gstin',
        label: 'GST IN',
        type: 'text',
        required: true,
        placeholder: '22AAAAA0000A1Z5',
        icon: BadgeIndianRupee,
        registrationType:['restaurant'],
        validation: (value: string) => {
          if (!value) return 'GST IN is required';
          // Full pattern validation
          const pattern = /^22[A-Z]{5}\d{4}[A-Z]{1}\d{1}[A-Z]{1}\d{1}$/;
          if (!pattern.test(value)) return 'Invalid GST IN';
        }
      }
    ],
    // Step 3: Address Information
    [
      {
        id: 'address.addressLine1',
        label: 'Address Line 1',
        type: 'text',
        required: true,
        placeholder: 'Street address',
        icon: Home,
        registrationType:['customer','restaurant'],
        validation: (value: string) => !value ? 'Address line 2 is required' : ''
      },
      {
        id: 'address.addressLine2',
        label: 'Address Line 2',
        type: 'text',
        required: true,
        placeholder: 'Apartment, suite, etc. (optional)',
        icon: Home,
        registrationType:['customer','restaurant'],
        validation: (value: string) => !value ? 'Address line 2 is required' : ''
      },
      {
        id: 'address.city',
        label: 'City',
        type: 'text',
        required: true,
        placeholder: 'City',
        icon: Building,
        registrationType:['customer','restaurant'],
        validation: (value: string) => !value ? 'City is required' : ''
      },
      {
        id: 'address.state',
        label: 'State',
        type: 'text',
        placeholder: 'State',
        icon: Building,
        required: true,
        registrationType:['customer','restaurant'],
        validation: (value: string) => !value ? 'State is required' : ''
      },
      {
        id: 'address.country',
        label: 'Country',
        type: 'text',
        placeholder: 'Country',
        icon: Building,
        required: true,
        registrationType:['customer','restaurant'],
        validation: (value: string) => !value ? 'Country is required' : ''
      },
      {
        id: 'address.pincode',
        label: 'PIN Code',
        type: 'text',
        placeholder: '123456',
        icon: MapPin,
        required: true,
        registrationType:['customer','restaurant'],
        validation: (value: string) => {
          if (!value) return 'PIN code is required';
          if (!/^\d{6}$/.test(value)) return 'Invalid PIN code format';
          return '';
        }
      },
      {
        id: 'tableCount',
        label: 'Table Count',
        type: 'number',
        required: true,
        placeholder: '10',
        icon: BadgeIndianRupee,
        registrationType:['restaurant'],
        validation: (value: string) => {
          if (!value) return 'Table count is required';
        }
      }
    ],
    // Step 4: Allergies
    [
      {
        id: 'allergies',
        label: 'Allergies',
        type: 'text',
        required: true,
        placeholder: 'Add allergies',
        icon: NutOff,
        registrationType:['customer'],
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

  const currentFields = formFields[currentStep].filter(field => 
    field.registrationType.includes(registrationType || '')
  );

  const filteredFormFields = formFields.map(stepFields =>
    stepFields.filter(field => field.registrationType.includes(registrationType || ''))
  ).filter(stepFields => stepFields.length > 0);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateStep(currentStep) && registrationType) {
      if (registrationType === "restaurant") {
        delete (formData as Partial<typeof formData>).allergies;
        delete (formData as Partial<typeof formData>).dob;
        
      }
      console.log('Form submitted:', formData);
      handleRegister(formData, registrationType, navigate);
    }
  };

  const renderAllergiesStep = () => (
    <div className="space-y-4 md:h-[320px]">
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
    <div className="min-h-screen flex items-center justify-center bg-orange-50">
      <div className="w-full p-4 bg-orange-50">
        <div className="space-y-1 p-6 sm:p-8">
          <div className="text-2xl sm:text-3xl font-bold tracking-tight">
            Create an account 👋
            <p className="text-sm mt-2">{`[ Step ${currentStep + 1} of ${filteredFormFields.length} ]`}</p>
          </div>
          <p className="text-sm">
            Enter your information to get started
          </p>
        </div>
        <div className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className={`${currentFields.some(field => field.id === "allergies") ? "" : "grid grid-cols-1 md:grid-cols-2"} gap-x-8 md:gap-y-3`}>
              {currentFields.map((field, index) => {
                if (field.id === "allergies") {
                  return renderAllergiesStep();
                }

                return (
                  <div key={index} className="space-y-2">
                    <Label htmlFor={field.id} className="text-sm font-medium block">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </Label>
                        <div className="relative">
                          <field.icon className="absolute left-3 md:top-8 top-6 -translate-y-1/2 h-5 w-5 text-gray-500" />
                          <Input
                            id={field.id}
                            type={field.type}
                            placeholder={field.placeholder}
                            className={`px-10 md:py-8 h-12 w-full rounded-none bg-white ${errors[field.id] ? 'input-error-color' : ''}`}
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
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-8 border-t pt-6">
              {currentStep > 0 && (
                <Button
                  type="button"
                  onClick={handlePrevious}
                  className=" hover:bg-orange-100 rounded-none bg-transparent border-orange-400 hover:border-swiggyOrange border-2"
                >
                   <ArrowLeft className="text-swiggyOrange"/>
                </Button>
              )}
              {currentStep < filteredFormFields.length - 1 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="w-full rounded-none sm:w-32 bg-swiggyOrange hover:bg-orange-500 flex items-center"
                >
                  <p>Next</p> <ArrowRight />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="w-full rounded-none sm:w-48 bg-swiggyOrange hover:bg-orange-500"
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
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
             Back to home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;