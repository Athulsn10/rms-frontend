import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast, { Toaster } from 'react-hot-toast';
import { Checkbox } from "@/components/ui/checkbox";
import { getUserDetail, updateUserProfile } from './profileService';
import { User, MapPin, Building, Home, NutOff, Phone, Cake, Loader2, CircleAlert, CircleCheck, ArrowRight, ArrowLeft, Check } from 'lucide-react';


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
    dob: string,
    address: AddressData;
    allergies: string[];
}

const Registration = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        name: '',
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

    const handleNext = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (validateStep(currentStep)) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        setCurrentStep(prev => prev - 1);
    };

    const handleSubmit = async (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsLoading(true);
        if (validateStep(currentStep)) {
            console.log('Form submitted:', formData);
            const response = await updateUserProfile(formData);
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

    const getCurrentUser = async () => {
        const response = await getUserDetail();
        setFormData({
            name: response.name || '',
            phone: response.phone?.toString() || '',
            dob: response.dob || '',
            address: {
                addressLine1: response.address?.addressLine1 || '',
                addressLine2: response.address?.addressLine2 || '',
                city: response.address?.city || '',
                state: response.address?.state || '',
                country: response.address?.country || '',
                pincode: response.address?.pincode || '',
            },
            allergies: response.allergies || [],
        });
    }

    useEffect(() => {
        getCurrentUser()
    }, [])

    return (
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
                                <ArrowLeft className="w-7 h-7"/>
                            </div>
                        )}
                        {currentStep < formFields.length - 1 ? (
                            <div onClick={handleNext} className="bg-orange-100 hover:bg-orange-200 p-2 rounded-full cursor-pointer">
                                <ArrowRight className="w-7 h-7"/>
                            </div>
                        ) : (
                            <div onClick={handleSubmit}className="">
                                {
                                    isLoading ? (
                                        <div className="bg-orange-100 hover:bg-orange-200 p-2 rounded-full cursor-progress">
                                            <Loader2 className="w-7 h-7 animate-spin"/>
                                        </div>
                                    ) : (
                                       <div className="bg-orange-100 hover:bg-orange-200 p-2 rounded-full cursor-pointer">
                                            <Check className="w-7 h-7"/>
                                       </div>
                                    )
                                }
                            </div>
                        )}
                    </div>
                </div>
                <div className="p-6 sm:p-8">
                    <form className="space-y-6">
                        <div className={`${currentFields.some(field => field.id === "allergies") ? "" : "grid grid-cols-1 md:grid-cols-2"} gap-2 gap-x-6`}>
                            {currentFields.map((field, index) => {
                                
                                if (field.id === "allergies") {
                                    return renderAllergiesStep();
                                }

                                return (
                                    <div key={index} className="space-y-2">
                                        <Label htmlFor={field.id} className="text-sm font-medium block">
                                            {field.label}
                                        </Label>
                                        <div className="relative">
                                            <field.icon className="absolute left-3 top-6 -translate-y-1/2 h-5 w-5 text-gray-500" />
                                            <Input
                                                id={field.id}
                                                type={field.type}
                                                placeholder={field.placeholder}
                                                className="p-10 pt-0 pb-0 pr-0 h-12 w-full bg-white"
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
    );
};

export default Registration;