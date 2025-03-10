import "../auth.css";
import { FormEvent, useRef, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { handleCustomerRegister, handleRestuarantRegister } from '../authService';
import toast, { Toaster } from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom';
import { MultiSelect } from "@/components/ui/multiselect";
import { Mail, Lock, User, MapPin, Building, Home, NutOff, Phone, BadgeIndianRupee, ArrowRight, ArrowLeft, CircleAlert, Loader2, Utensils, WalletCards, Camera, ImageIcon, X, CircleCheck } from 'lucide-react';


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
  address: AddressData;
  allergies: string[];
  gstin: string;
  upiId: string;
  tableCount: string;
}

const Registration = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [preview, setPreview] = useState<any>();
  const registrationType = searchParams.get('type');
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: {
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      country: '',
      pincode: '',
    },
    allergies: [],
    gstin: '',
    tableCount: '',
    upiId: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const commonAllergies = [
    { value: "peanuts", label: "Peanuts" },
    { value: "shellfish", label: "Shellfish" },
    { value: "milk", label: "Milk" },
    { value: "eggs", label: "Eggs" },
    { value: "tree_nuts", label: "Tree Nuts" },
    { value: "soy", label: "Soy" },
    { value: "wheat", label: "Wheat" },
    { value: "fish", label: "Fish" },
    { value: "sesame", label: "Sesame" },
    { value: "dust_mites", label: "Dust Mites" },
    { value: "pollen", label: "Pollen" },
    { value: "mold", label: "Mold" },
    { value: "animal_dander", label: "Animal Dander" },
    { value: "latex", label: "Latex" },
    { value: "insect_stings", label: "Insect Stings" },
    { value: "penicillin", label: "Penicillin" },
    { value: "aspirin", label: "Aspirin" },
    { value: "sulfites", label: "Sulfites" },
    { value: "red_dye", label: "Red Dye" },
    { value: "perfumes", label: "Perfumes" },
    { value: "nickel", label: "Nickel" },
    { value: "chocolate", label: "Chocolate" },
    { value: "gluten", label: "Gluten" },
    { value: "corn", label: "Corn" },
    { value: "citrus_fruits", label: "Citrus Fruits" },
    { value: "strawberries", label: "Strawberries" },
    { value: "bananas", label: "Bananas" },
    { value: "kiwi", label: "Kiwi" },
    { value: "avocado", label: "Avocado" },
    { value: "sunflower_seeds", label: "Sunflower Seeds" },
    { value: "pork", label: "Pork" },
    { value: "beef", label: "Beef" },
    { value: "chicken", label: "Chicken" },
    { value: "celery", label: "Celery" },
    { value: "mustard", label: "Mustard" },
    { value: "garlic", label: "Garlic" },
    { value: "onion", label: "Onion" },
    { value: "pepper", label: "Pepper" },
    { value: "chili", label: "Chili" },
    { value: "yeast", label: "Yeast" },
    { value: "tomatoes", label: "Tomatoes" },
    { value: "spinach", label: "Spinach" },
    { value: "peaches", label: "Peaches" },
    { value: "apples", label: "Apples" },
    { value: "grapes", label: "Grapes" },
    { value: "melons", label: "Melons" },
    { value: "caffeine", label: "Caffeine" },
    { value: "alcohol", label: "Alcohol" },
    { value: "preservatives", label: "Preservatives" },
    { value: "food_colorings", label: "Food Colorings" },
  ];

  const formFields = [
    // Step 1: Personal Information
    [
      {
        id: 'name',
        label: 'Full Name',
        type: 'text',
        placeholder: 'Enter Name',
        icon: User,
        required: true,
        registrationType: ['customer', 'restaurant'],
        validation: (value: string) => !value ? 'Full name is required' : ''
      },
      {
        id: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'name@example.com',
        icon: Mail,
        required: true,
        registrationType: ['customer', 'restaurant'],
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
        registrationType: ['customer', 'restaurant'],
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
        registrationType: ['customer', 'restaurant'],
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
        registrationType: ['customer', 'restaurant'],
        validation: (value: string) => {
          if (!value) return 'Phone number is required';
          if (!/^\d{10}$/.test(value)) return 'Phone number must be exactly 10 digits';
          return '';
        }
      },
      {
        id: 'gstin',
        label: 'GST IN',
        type: 'text',
        required: true,
        placeholder: '22AAAAA0000A1Z5',
        icon: BadgeIndianRupee,
        registrationType: ['restaurant'],
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
        registrationType: ['customer', 'restaurant'],
        validation: (value: string) => !value ? 'Address line 2 is required' : ''
      },
      {
        id: 'address.addressLine2',
        label: 'Address Line 2',
        type: 'text',
        required: true,
        placeholder: 'Apartment, suite, etc. (optional)',
        icon: Home,
        registrationType: ['customer', 'restaurant'],
        validation: (value: string) => !value ? 'Address line 2 is required' : ''
      },
      {
        id: 'address.city',
        label: 'City',
        type: 'text',
        required: true,
        placeholder: 'City',
        icon: Building,
        registrationType: ['customer', 'restaurant'],
        validation: (value: string) => !value ? 'City is required' : ''
      },
      {
        id: 'address.state',
        label: 'State',
        type: 'text',
        placeholder: 'State',
        icon: Building,
        required: true,
        registrationType: ['customer', 'restaurant'],
        validation: (value: string) => !value ? 'State is required' : ''
      },
      {
        id: 'address.country',
        label: 'Country',
        type: 'text',
        placeholder: 'Country',
        icon: Building,
        required: true,
        registrationType: ['customer', 'restaurant'],
        validation: (value: string) => !value ? 'Country is required' : ''
      },
      {
        id: 'address.pincode',
        label: 'PIN Code',
        type: 'text',
        placeholder: '123456',
        icon: MapPin,
        required: true,
        registrationType: ['customer', 'restaurant'],
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
        icon: Utensils,
        registrationType: ['restaurant'],
        validation: (value: string) => {
          if (!value) return 'Table count is required';
        }
      },
      {
        id: 'upiId',
        label: 'UPI Id',
        type: 'text',
        required: true,
        placeholder: 'example@oksbi',
        icon: WalletCards,
        registrationType: ['restaurant'],
        validation: (value: string) => {
          if (!value) return 'UPI Id is required';
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
        registrationType: ['customer'],
        validation: () => ''
      },
      {
        id: 'image',
        label: 'Profile Photo',
        type: 'file',
        required: true,
        placeholder: 'Upload Profile Photo',
        icon: Camera,
        registrationType: ['restaurant'],
        validation: () => ''
      }
    ],
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

  const currentFields = formFields[currentStep].filter(field =>
    field.registrationType.includes(registrationType || '')
  );

  const filteredFormFields = formFields.map(stepFields =>
    stepFields.filter(field => field.registrationType.includes(registrationType || ''))
  ).filter(stepFields => stepFields.length > 0);

  const validateStep = (step: number) => {
    const currentFields = filteredFormFields[step];
    const newErrors = {} as Record<string, string>;
    let isValid = true;

    currentFields.forEach(field => {
      const value = field.id.includes('.')
        ? formData.address[field.id.split('.')[1] as keyof AddressData]
        : formData[field.id as keyof FormData];
      // if (field.id === "confirmPassword") {
      //   console.log(field.validation(value as string))
      // }
      const error = field.validation(value as string);
      if (error) {
        newErrors[field.id] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleFileChange = async (e:any) => {
    const file = e.target.files[0];
    // await handleImageUpload(file);
    if (file) {
      const reader:any = new FileReader();
    reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
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
    setIsLoading(true);

    if (validateStep(currentStep) && registrationType) {
      if (registrationType === "restaurant") {
        delete (formData as Partial<typeof formData>).allergies;
      } else {
        formData.allergies = selectedAllergies;
        delete (formData as Partial<typeof formData>).gstin;
        delete (formData as Partial<typeof formData>).tableCount;
        delete (formData as Partial<typeof formData>).upiId;
      }

      let response;
      if ( registrationType === 'restaurant' ) {
        const data = new FormData();
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('password', formData.password);
        data.append('phone', formData.phone);
        data.append('gstin', formData.gstin);
        data.append('tableCount', formData.tableCount);
        data.append('upiId', formData.upiId);
        data.append('address[addressLine1]', formData.address.addressLine1);
        data.append('address[addressLine2]', formData.address.addressLine2);
        data.append('address[city]', formData.address.city);
        data.append('address[state]', formData.address.state);
        data.append('address[country]', formData.address.country);
        data.append('address[pincode]', formData.address.pincode);

      if (fileInputRef.current && fileInputRef.current.files?.[0]) {
        data.append('image', fileInputRef.current.files[0]);
      }
        response = await handleRestuarantRegister(data);
      } else {
        response = await handleCustomerRegister(formData);
      }

     
      if (response.status) {
        setIsLoading(false);
        toast.success('Registration success, Please login!', {
          icon: <CircleCheck color="#1ce867" />,
        });
        setTimeout(() => {
          navigate("/");
        }, 2000)
      } else {
        toast.error(`${response.message}`, {
          icon: <CircleAlert color="#fc3419" />,
        });
        setIsLoading(false);
      }
    }
  };

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
            <div className={`${currentFields.some(field => field.id === "allergies" || field.id === "image") ? "" : "grid grid-cols-1 md:grid-cols-2"} gap-x-8 md:gap-y-3`}>
              {currentFields.map((field, index) => {
                if (field.id === "allergies") {
                  return (
                    <div>
                      <p className="flex items-center justify-center text-xl font-bold">{field.label}</p>
                      <MultiSelect
                        className="bg-white border-r-0 py-5 hover:bg-white"
                        options={commonAllergies}
                        onValueChange={setSelectedAllergies}
                        placeholder="Select Allergies"
                        variant="rmscolor"
                        animation={2}
                        maxCount={6} />
                    </div>)
                }

                if (field.id.toLowerCase() === "image") {
                  return (
                    <>
                      <div className="flex flex-col items-center">
                        <Input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept="image/*"
                          className="hidden"
                          id="menuItemImage"
                        />
                        <Label
                          htmlFor="menuItemImage"
                          className={`
                              relative
                              w-56 h-56
                              flex items-center justify-center 
                              rounded-full
                              cursor-pointer
                              transition-all duration-300
                              overflow-hidden
                              group
                              ${preview ?
                              'border-none shadow-lg' :
                              'border-2 border-dashed border-gray-300 hover:border-orange-400 hover:bg-orange-50'
                            }`}>
                          {preview ? (
                            <div className="w-full h-full relative">
                              <img
                                src={preview}
                                alt="Preview"
                                className="w-full h-full object-cover"
                              />
                              <div className="
                                      absolute inset-0 
                                      bg-black/0 group-hover:bg-black/40
                                      transition-all duration-300
                                      flex items-center justify-center
                                      opacity-0 group-hover:opacity-100">
                                <Camera className="w-8 h-8 text-white" />
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center space-y-2 p-4">
                              <div className="
                                      w-12 h-12 
                                      rounded-full 
                                      bg-orange-100 
                                      flex items-center justify-center
                                      group-hover:bg-orange-200
                                      transition-colors duration-300
                                    ">
                                <Camera className="h-6 w-6 text-orange-600" />
                              </div>
                              <span className="text-sm text-gray-600 text-center">
                                Upload Profile
                              </span>
                            </div>
                          )}
                        </Label>
                      </div>
                    </>
                  )
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
                        value={(field.id.includes('.') ? formData.address[field.id.split('.')[1] as keyof AddressData] : formData[field.id as keyof FormData]) as any}
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
                  className="hover:bg-orange-100 rounded-none bg-transparent border-orange-400 hover:border-swiggyOrange border-2"
                >
                  <ArrowLeft className="text-swiggyOrange" />
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
                  disabled={isLoading}
                  className="w-full rounded-none sm:w-48 bg-swiggyOrange hover:bg-orange-500"
                >
                  {
                    isLoading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <span>Create Account</span>
                    )
                  }
                </Button>
              )}
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-500">Already have an account?</span>{' '}
            <button
              onClick={() => navigate('/')}
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              Back to home
            </button>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Registration;