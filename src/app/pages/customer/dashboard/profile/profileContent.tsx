import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast, { Toaster } from 'react-hot-toast';
import { MultiSelect } from "@/components/ui/multiselect";
import { getUserDetail, updateUserProfile } from '../../customerService';
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

const ProfileContent = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(false);
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
    const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
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

    const handleSubmit = async (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsLoading(true);
        if (validateStep(currentStep)) {
            formData.allergies = selectedAllergies;
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

    const getCurrentUser = async () => {
        setFetchingData(true);
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
        setSelectedAllergies(response.allergies || []);
        setFetchingData(false);
    };

    useEffect(() => {
        getCurrentUser()
    }, [])

    return (
        <>
            {fetchingData ? (
                <div className='flex items-center justify-center h-96 text-orange-600'>
                    <Loader2 className="w-9 h-9 animate-spin" />
                </div>) :
                (<div className="flex w-full">
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
                                <div className={`${currentFields.some(field => field.id === "allergies") ? "" : "grid grid-cols-1 md:grid-cols-2"} gap-x-8 md:gap-y-3`}>
                                    {currentFields.map((field, index) => {

                                        if (field.id === "allergies") {
                                            return (
                                                <div>
                                                    <p className="flex items-center justify-center text-xl font-bold pb-5">{field.label}</p>
                                                    <MultiSelect
                                                        className="bg-white border-r-0 py-5 hover:bg-white"
                                                        options={commonAllergies}
                                                        defaultValue={selectedAllergies}
                                                        onValueChange={setSelectedAllergies}
                                                        placeholder="Modify your allergies"
                                                        variant="rmscolor"
                                                        animation={2}
                                                        maxCount={6} />
                                                </div>
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
                </div>)
            }
        </>
    );
};

export default ProfileContent;