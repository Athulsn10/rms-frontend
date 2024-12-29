import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createMenu, getMenus } from './restuarantService';
import { ingredientsList } from "./restuarantData";
import { useRef, useState, useEffect } from "react"
import { MultiSelect } from "@/components/ui/multiselect";
import { Card, CardContent } from "@/components/ui/card";
import { Circle, CircleAlert, CircleCheck, IndianRupee, Loader2, Plus, ShoppingBasket, Soup, Triangle, Vegan } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import toast, { Toaster } from "react-hot-toast";


interface Menu {
  dishName: string;
  picture: File | null;
  isVeg: boolean | string;
  ingredients: string[];
  price: number | undefined;
};

function menu() {
  const [isVeg, setIsVeg] = useState(true);
  const [hasMenu, setHasMenu] = useState(false);
  const [menuList, setMenuList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [menu, setMenu] = useState<Menu>({
    dishName: '',
    picture: null,
    isVeg: isVeg,
    ingredients: [],
    price: undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const formFields = [
    {
      id: 'dishName',
      label: 'Item Name',
      type: 'text',
      placeholder: 'Mutton Soup',
      icon: Soup,
      required: true,
      validation: (value: string) => !value ? 'Dish name is required' : ''
    },
    {
      id: 'picture',
      label: 'Picture',
      type: 'file',
      placeholder: 'Upload item picture',
      icon: 'none',
      required: true,
      validation: (value: string) => !value ? 'Picture is required' : ''
    },
    {
      id: 'isVeg',
      label: 'Veg or Non Veg',
      type: 'toggle',
      placeholder: 'Mutton Soup',
      icon: Vegan,
      required: true,
      validation: (value: string) => !value ? 'Dish category is required' : ''
    },
    {
      id: 'price',
      label: 'Price',
      type: 'number',
      placeholder: 'Enter The Price',
      icon: IndianRupee,
      required: true,
      validation: (value: string) => !value ? 'Dish price is required' : ''
    },
    {
      id: 'ingredients',
      label: 'Ingredients',
      type: 'text',
      required: true,
      placeholder: 'Add ingredients',
      icon: ShoppingBasket,
      validation: () => selectedIngredients.length < 3 ? 'Minimum of three ingredients is required' : ''
    }
  ];

  const validateFields = () => {
    const newErrors = {} as Record<string, string>;
    let isValid = true;
    formFields.forEach(field => {
      const value = (menu as any)[field.id];
      const error = field.validation(value);

      if (error) {
        newErrors[field.id] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (id: string, value: string) => {
    setMenu(prev => {
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

  const handleMenuSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (validateFields()) {
      setIsLoading(true);
      
      if (!fileInputRef.current || !fileInputRef.current.files?.[0]) {
        toast.success('Please select an image file', {
          icon: <CircleCheck color="#1ce867" />,
        });
        setIsLoading(false);
        return;
      }
      
      // Create FormData
      const formData = new FormData();
      formData.append('name', menu.dishName);
      formData.append('image', fileInputRef.current.files[0]);
      formData.append('type', isVeg ? 'VEGETARIAN' : 'NONE_VEGETARIAN');
      formData.append('price', menu.price?.toString() || '');
      formData.append('status', 'AVAILABLE');

      // Append ingredients array
      selectedIngredients.forEach((ingredient) => {
        formData.append(`ingredients`, ingredient);
      });

      const response = await createMenu(formData);

      if (response) {
        setIsLoading(false);
        toast.success('Menu item created', {
          icon: <CircleCheck color="#1ce867" />,
        });
        setDialogOpen(false);
      } else {
        setIsLoading(false);
        toast.error('Something went wrong!', {
          icon: <CircleAlert color="#fc3419" />,
        });
      }
    }
  };

  const fetchMenus = async() => {
    const menuItems = await getMenus();

    if (menuItems.length > 0) {
      setMenuList(menuItems);
      setHasMenu(true);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen} >
        {!hasMenu ? (
          <div className="flex items-center w-100 justify-center md:h-[100%]">
            <Card className="md:w-[700px] h-96 bg-red-50">
              <CardContent className="flex flex-col items-center justify-center h-full text-center p-6 ">
                <DialogTrigger onClick={() => setDialogOpen(true)}>
                  <div className="bg-red-100 p-4 rounded-full mb-4 cursor-pointer">
                    <Plus size={48} className="text-red-500" />
                  </div>
                </DialogTrigger>
                <p className="text-gray-700 mb-4">
                  Add Menus, You don't have any menus yet!
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            <p>Render menu</p>
          </>
        )}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Menu Item</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 md:gap-y-3">
              {formFields.map((field, index) => {
                return (
                  <div key={index} className={`space-y-2 ${field.id === "ingredients" ? "col-span-full" : ""}`}>
                    {field.id === "ingredients" ? (
                      <>
                        <Label htmlFor={field.id} className="text-sm font-medium block">
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                        </Label>
                        <MultiSelect
                          className="px-10 md:py-8 h-12 w-full rounded-none bg-white"
                          options={ingredientsList}
                          onValueChange={setSelectedIngredients}
                          placeholder="Select Ingredients"
                          variant="rmscolor"
                          animation={2}
                          maxCount={7}
                        />
                        <div style={{ height: '6px', marginTop: '2px', display: 'flex', justifyContent: 'end', width: '100%' }}>
                          {errors[field.id] && (
                            <p className="text-red-500 text-xs">
                              {errors[field.id]}
                            </p>
                          )}
                        </div>
                      </>
                    ) : field.type === "toggle" ? (
                      <>
                        <Label htmlFor={field.id} className="text-sm font-medium block">
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                        </Label>
                        <div className="flex gap-4">
                          <Button className={`${isVeg ? "bg-green-600 text-white hover:bg-green-600" : "bg-green-200 hover:bg-green-200 text-green-600"}`} onClick={() => setIsVeg(true)}><Circle /></Button>
                          <Button className={`${!isVeg ? "bg-red-600 text-white hover:bg-red-600" : "bg-red-200 hover:bg-red-200  text-red-600"}`} onClick={() => setIsVeg(false)}><Triangle /></Button>
                        </div>
                        <p className="text-xs font-semibold italic">Default value is set to Veg, Please modify if needed!</p>
                      </>
                    )
                      : (
                        <>
                          <Label htmlFor={field.id} className="text-sm font-medium block">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                          </Label>
                          <div className="relative">
                            {field.type !== "file" && (
                              <field.icon className="absolute left-3 md:top-8 top-6 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            )}
                            <Input
                              id={field.id}
                              type={field.type}
                              ref={field.id === 'picture' ? fileInputRef : null}
                              value={(menu as any)[field.id]}
                              placeholder={field.placeholder}
                              onChange={(e) => handleInputChange(field.id, e.target.value)}
                              className="px-10 md:py-8 h-12 w-full rounded-none bg-white hover:shadow-sm"
                            />
                          </div>
                          <div style={{ height: '6px', marginTop: '2px', display: 'flex', justifyContent: 'end', width: '100%' }}>
                            {errors[field.id] && (
                              <p className="text-red-500 text-xs">
                                {errors[field.id]}
                              </p>
                            )}
                          </div>
                        </>
                      )}
                  </div>
                );
              })}
            </div>
          </DialogDescription>
          <Button disabled={isLoading} onClick={handleMenuSave} className="bg-swiggyOrange p-5 hover:bg-orange-500 rounded-none">
            {
              isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <span>Save</span>
              )
            }
          </Button>
        </DialogContent>
      </Dialog>
      <Toaster />
    </>
  )
}

export default menu