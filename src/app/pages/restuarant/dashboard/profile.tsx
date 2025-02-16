import { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast, { Toaster } from 'react-hot-toast';
import { getUserDetail, updateUserProfile } from './restuarantService';
import { User, MapPin, Building, Home, Phone, Loader2, CircleAlert, CircleCheck, ArrowRight, ArrowLeft, Check, BadgeIndianRupee, Utensils, Camera, WalletCards } from 'lucide-react';


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
    phone: string,
    gstin: string,
    upiId: string;
    tableCount: string,
    address: AddressData;
}

const Profile = () => {
    const [preview, setPreview] = useState<any>();
    const base_url = import.meta.env.VITE_BASE_URL;
    const [currentStep, setCurrentStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        phone: '',
        gstin: '',
        upiId:'',
        tableCount: '',
        address: {
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            country: '',
            pincode: '',
        },
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

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
                id: 'tableCount',
                label: 'Table Count',
                type: 'text',
                required: true,
                placeholder: '0',
                icon: Utensils,
                registrationType: ['restaurant'],
                validation: (value: string) => {
                    if (!value) return 'Table count is required';
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
        // Step 3: Adress info
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
        // Step 4: Profile picture
        [
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

    const validateStep = (step: number) => {
        const currentFields = formFields[step];
        const newErrors = {} as Record<string, string>;
        let isValid = true;

        currentFields.forEach(field => {
            const value = field.id.includes('.')
                ? formData.address[field.id.split('.')[1] as keyof AddressData]
                : formData[field.id as keyof FormData];
            // if (field.id === "confirmPassword") {
            //     console.log(field.validation(value as string))
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

    const handleNext = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (validateStep(currentStep)) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        setCurrentStep(prev => prev - 1);
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

    const handleSubmit = async (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsLoading(true);
        if (validateStep(currentStep)) {
            const data = new FormData();
            data.append('name', formData.name);
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
            const response = await updateUserProfile(data);
            if (response) {
                setIsLoading(false);
                toast.success('Profile Updated', {
                    icon: <CircleCheck color="#1ce867" />,
                });
                setCurrentStep(0)
            } else {
                setIsLoading(false);
                toast.error('Profile Updated Failed', {
                    icon: <CircleAlert color="#fc3419" />,
                });
            }
        }
    };

    const currentFields = formFields[currentStep];

    const getCurrentUser = async () => {
        setFetchingData(true);
        const response = await getUserDetail();
        if (response === 'Token not valid') {
            toast.success('Session timeout, Please login again!', {
                icon: <CircleCheck color="#1ce867" />,
            });
        }
        setFormData({
            name: response.name || '',
            phone: response.phone?.toString() || '',
            gstin: response.gstin || '',
            upiId: response.upiId || '',
            tableCount: response.tableCount || '',
            address: {
                addressLine1: response.address?.addressLine1 || '',
                addressLine2: response.address?.addressLine2 || '',
                city: response.address?.city || '',
                state: response.address?.state || '',
                country: response.address?.country || '',
                pincode: response.address?.pincode || '',
            }
        });
        setPreview(`${base_url}files/restaurants/${response.images}`);
        setFetchingData(false);
    };

    useEffect(() => {
        getCurrentUser()
    }, [])

    return (
        <>
            {fetchingData ? (
                <div className='flex items-center justify-center h-full text-orange-600'>
                    <Loader2 className="w-9 h-9 animate-spin" />
                </div>) : (
                <div className="flex w-full">
                    <div className="w-full">
                        <div className='flex justify-between me-5 items-center'>
                            <div className="space-y-1 sm:p-8">
                                <div className="text-2xl sm:text-3xl font-bold tracking-tight">
                                    Edit your Account
                                    <p className="text-sm mt-2">{`[ Page ${currentStep + 1} of ${formFields.length} ]`}</p>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 sm:gap-4 mt-8 border-t pt-6">
                                {currentStep > 0 && (
                                    <div onClick={handlePrevious} className="bg-orange-100 hover:bg-orange-200 p-2 rounded-full cursor-pointer">
                                        <ArrowLeft className="w-7 h-7" />
                                    </div>
                                )}
                                {currentStep < formFields.length - 1 ? (
                                    <div onClick={handleNext} className="bg-orange-100 hover:bg-orange-200 p-2 rounded-full cursor-pointer">
                                        <ArrowRight className="w-7 h-7" />
                                    </div>
                                ) : (
                                    <div onClick={handleSubmit} className="">
                                        {
                                            isLoading ? (
                                                <div className="bg-orange-100 hover:bg-orange-200 p-2 rounded-full cursor-progress">
                                                    <Loader2 className="w-7 h-7 animate-spin" />
                                                </div>
                                            ) : (
                                                <div className="bg-orange-100 hover:bg-orange-200 p-2 rounded-full cursor-pointer">
                                                    <Check className="w-7 h-7" />
                                                </div>
                                            )
                                        }
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="p-6 sm:p-8">
                            <form className="space-y-6">
                                <div className={`${currentFields.some(field => field.id === "image") ? "" : "grid grid-cols-1 md:grid-cols-2"} gap-2 gap-x-6`}>
                                    {currentFields.map((field, index) => {
                                        if (field.id.toLowerCase() === "image") {
                                            return (
                                              <>
                                                <p className='font-semibold'>Edit Profile Picture</p>
                                                <div className="flex justify-center h-96 items-center">
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
                                                        w-80 h-80
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
                                                    {field.label}
                                                </Label>
                                                <div className="relative">
                                                    <field.icon className="absolute left-3 top-8 -translate-y-1/2 h-5 w-5 text-gray-500" />
                                                    <Input
                                                        id={field.id}
                                                        type={field.type}
                                                        placeholder={field.placeholder}
                                                        className="px-10 md:py-8 h-12 rounded-none w-full bg-white"
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
                            </form>
                        </div>
                    </div>
                    <Toaster />
                </div>
            )}
        </>
    );
};

export default Profile;