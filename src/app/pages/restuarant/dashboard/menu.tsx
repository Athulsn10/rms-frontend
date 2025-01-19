import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from "react-hot-toast";
import { ingredientsList } from "./restuarantData";
import { useRef, useState, useEffect } from "react";
import { MultiSelect } from "@/components/ui/multiselect";
import { Card, CardContent } from "@/components/ui/card";
import { createMenu, deleteMenu, editMenu, getMenus, imageUpload } from './restuarantService';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Circle, CircleAlert, CircleCheck, CircleX, Flame, IndianRupee, Loader2, Pencil, Plus, Search, ShoppingBasket, Soup, Trash2, Triangle, Vegan } from "lucide-react";



interface Menu {
  dishName: string;
  image: File | null;
  isVeg: boolean | string;
  ingredients: string[];
  price: number | undefined;
  calories:number | undefined;
};

function menu() {
  const [isVeg, setIsVeg] = useState(true);
  const [hasMenu, setHasMenu] = useState(false);
  const [menuList, setMenuList] = useState([]);
  const [calories, setCalories] = useState();
  const [searchValue, setSearchValue] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editItemId, setEditItemId] = useState("");
  const [multiSelectKey, setMultiSelectKey] = useState(0);
  const [fetchingData, setFetchingData] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [menu, setMenu] = useState<Menu>({
    dishName: '',
    image: null,
    isVeg: isVeg,
    ingredients: [],
    price: undefined,
    calories: undefined
  });

  const base_url = import.meta.env.VITE_BASE_URL;

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
      id: 'image',
      label: 'image',
      type: 'file',
      placeholder: 'Upload item image',
      icon: 'none',
      required: true,
      validation: (value: string) => !value ? 'image is required' : ''
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
      id: 'calories',
      label: 'Calories',
      type: 'number',
      placeholder: 'Enter Total Calories',
      icon: Flame,
      required: true,
      validation: (value: string) => !value ? 'Dish Calories is required' : ''
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

  const handleImageUpload = async (value: any) => {
    setAiLoading(true);
    const aiResult = await imageUpload(value);
    console.log('a:',aiResult)

    if (aiResult) {
      setSelectedIngredients(aiResult.ingredients);
      setCalories(aiResult.calories);
      setAiLoading(false);
    } else {
      toast.error('AI failed to fetch ingredients!', {
        icon: <CircleX color="#fc3419" />,
      });
      setAiLoading(false);
    }
  }

  const handleInputChange = (id: string, value: string) => {
    if (id === 'image' && fileInputRef.current && fileInputRef.current.files?.[0]) {
      console.log('fileInputRef:',fileInputRef.current.value)
      handleImageUpload(fileInputRef.current.files[0]);
    };

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
        toast.error('Please select an image file', {
          icon: <CircleAlert color="#fc3419" />,
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
      let response;
      if (isEditMode) {
        const id = editItemId;
        response = await editMenu(id,formData);
      } else {
        response = await createMenu(formData);
      }
     
      if (response) {
        setIsLoading(false);
        toast.success(`Menu item ${isEditMode ? "modified" : "created"}`, {
          icon: <CircleCheck color="#1ce867" />,
        });
        fetchMenus();
        setDialogOpen(false);
      } else {
        setIsLoading(false);
        toast.error('Something went wrong!', {
          icon: <CircleAlert color="#fc3419" />,
        });
      }
    }
  };

  const handleMenuDelete = async (itemId: string) => {
    const response = await deleteMenu(itemId);
    if (response) {
      toast.success('Menu item deleted', {
        icon: <CircleCheck color="#1ce867" />,
      });
      setMenuList(prevItems => prevItems.filter((item: any) => item._id !== itemId));
    } else {
      toast.error('Failed please try after sometime!', {
        icon: <CircleX color="#fc3419" />,
      });
    }
  };

  const handleMenuEdit = async (itemId: string) => {
    setIsEditMode(true);
    setEditItemId(itemId);
    const selectedItem: any = menuList.find((item: any) => item._id === itemId);
    if (selectedItem) {
      setMenu({
        dishName: selectedItem.name,
        image: null,
        isVeg: selectedItem.type === 'VEGETARIAN' ? true : false,
        ingredients: selectedItem.ingredients,
        price: selectedItem.price,
        calories: selectedItem.calories
      });
    }
    setIsVeg(selectedItem.type === 'VEGETARIAN' ? true : false);
    setSelectedIngredients(selectedItem.ingredients);
    setDialogOpen(true);
  };

  const fetchMenus = async () => {
    setFetchingData(true);
    const menuItems = await getMenus();

    if (menuItems.length > 0) {
      setMenuList(menuItems);
      setHasMenu(true);
    }
    setFetchingData(false);
  };

  const handleSearch = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log('searchValue', searchValue)
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  useEffect(() => {
    setCalories((menu as any).calories || '');
  }, [menu]);

  useEffect(() => {
    setMultiSelectKey(multiSelectKey + 1);
  }, [selectedIngredients]);

  useEffect(() => {
    if (!dialogOpen) {
      setMenu({
        dishName: '',
        image: null,
        isVeg: isVeg,
        ingredients: [],
        price: undefined,
        calories: undefined
      });
      setSelectedIngredients([]);
    }
  }, [dialogOpen]);

  return (
    <>
      {fetchingData ? (
        <div className='flex items-center justify-center h-full text-orange-600'>
          <Loader2 className="w-9 h-9 animate-spin" />
        </div>) :
        (
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
                  <div className="w-100 flex justify-center bg-orange-100">
                    <div className="flex flex-col p-4 md:flex-row items-center justify-between gap-4 md:gap-16 w-full max-w-7xl">
                      <Button className="flex items-center bg-orange-200 rounded-none w-100 md:w-50 hover:bg-orange-200 px-5 py-5" onClick={() => setDialogOpen(true)}>
                        <Plus size={28} className="text-orange-500" />
                        <p className="font-bold text-orange-500 text-xl"> Add Menu</p>
                      </Button>

                      <div className="flex items-center w-full md:w-auto justify-center">
                        <div className="relative w-full md:w-[700px]">
                          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input onChange={(e) => setSearchValue(e.target.value)} className="font-medium w-full py-5 rounded-none" placeholder="Search Menu Item" />
                        </div>
                        <Button onClick={handleSearch} className="flex ml-2 md:ml-4 items-center bg-orange-200 rounded-none hover:bg-orange-200 px-5 py-5">
                          <Search size={28} className="text-orange-500" />
                          <p className="font-bold text-orange-500 text-xl hidden md:inline">Search</p>
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-10 grid grid-cols-1 md:grid-cols-3 gap-x-8 md:gap-y-3">
                    {menuList.map((item: any) => (
                      <Card key={item._id} className="overflow-hidden bg-white shadow-md border-none rounded-sm mb-4">
                        <div className="relative h-48 w-full overflow-hidden">
                          <img
                            src={`${base_url}files/menus/${item.images}`}
                            alt={item.name}
                            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => handleMenuDelete(item._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            className="absolute top-2 right-14 bg-orange-400 hover:bg-orange-300"
                            onClick={() => handleMenuEdit(item._id)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                            <div className="flex items-center">
                              <span className="text-2xl font-bold text-green-600">₹{item.price}</span>
                            </div>
                          </div>

                          <div className="flex gap-2 mb-4">
                            <Badge className={`${item.type === 'VEGETARIAN' ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
                              {item.type.replace('_', ' ')}
                            </Badge>
                            <Badge >
                              {item.status}
                            </Badge>
                          </div>

                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Ingredients:</h4>
                            <div className="flex flex-wrap gap-2">
                              {item.ingredients.map((ingredient, index) => (
                                <Badge key={index} variant="outline" className="bg-gray-100">
                                  {ingredient.replace('_', ' ')}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </>
              )}
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Menu Item</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                  <div className="">
                    {aiLoading && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="inline-block transition-all duration-300">
                          <img
                            style={{ height: '60px' }}
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Google_Bard_logo.svg/900px-Google_Bard_logo.svg.png"
                            className="text-orange-600 animate-[pulse_1000ms_ease-in-out_infinite]"
                          />
                        </div>
                      </div>
                    )}
                    <div className={`${aiLoading ? 'blur-sm pointer-events-none' : ''}`}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 md:gap-y-3">
                        {formFields.map((field, index) => (
                          <div key={index} className={`space-y-2 ${field.id === "ingredients" ? "col-span-full" : ""}`}>
                            {field.id === "ingredients" ? (
                              <>
                                <Label htmlFor={field.id} className="text-sm font-medium block">
                                  {field.label} {field.required && <span className="text-red-500">*</span>}
                                </Label>
                                <MultiSelect
                                  key={multiSelectKey}
                                  className="px-10 md:py-6 h-12 w-full rounded-none bg-white"
                                  options={ingredientsList}
                                  defaultValue={selectedIngredients}
                                  onValueChange={setSelectedIngredients}
                                  placeholder="Select Ingredients"
                                  variant="rmscolor"
                                  animation={2}
                                  maxCount={7}
                                />
                                <div style={{ height: '6px', marginTop: '2px', display: 'flex', justifyContent: 'end', width: '100%' }}>
                                  {errors[field.id] && (
                                    <p className="text-red-500 text-xs">{errors[field.id]}</p>
                                  )}
                                </div>
                              </>
                            ) : field.type === "toggle" ? (
                              <>
                                <Label htmlFor={field.id} className="text-sm font-medium block">
                                  {field.label} {field.required && <span className="text-red-500">*</span>}
                                </Label>
                                <div className="flex gap-4">
                                  <Button
                                    className={`${isVeg ? "bg-green-600 text-white hover:bg-green-600" : "bg-green-200 hover:bg-green-200 text-green-600"}`}
                                    onClick={() => setIsVeg(true)}
                                  >
                                    <Circle />
                                  </Button>
                                  <Button
                                    className={`${!isVeg ? "bg-red-600 text-white hover:bg-red-600" : "bg-red-200 hover:bg-red-200  text-red-600"}`}
                                    onClick={() => setIsVeg(false)}
                                  >
                                    <Triangle />
                                  </Button>
                                </div>
                                <p className="text-xs font-semibold italic">Default value is set to Veg, Please modify if needed!</p>
                              </>
                            ) : (
                              <>
                                <Label htmlFor={field.id} className="text-sm font-medium block">
                                  {field.label} {field.required && <span className="text-red-500">*</span>}
                                </Label>
                                <div className="relative">
                                  {field.type !== "file" && (
                                    <field.icon className="absolute left-3 md:top-6 top-6 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                  )}
                                  {field.type === "file" ? (
                                    <Input
                                      id={field.id}
                                      type="file"
                                      ref={fileInputRef}
                                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                                      className="px-10 md:py-6 h-12 w-full rounded-none bg-white hover:shadow-sm"
                                    />
                                  ) : (
                                    <Input
                                      id={field.id}
                                      type={field.type}
                                      value={field.id == 'calories' ? calories : (menu as any)[field.id]}
                                      placeholder={field.placeholder}
                                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                                      className="px-10 md:py-6 h-12 w-full rounded-none bg-white hover:shadow-sm"
                                    />
                                  )}
                                </div>
                                <div style={{ height: '6px', marginTop: '2px', display: 'flex', justifyContent: 'end', width: '100%' }}>
                                  {errors[field.id] && (
                                    <p className="text-red-500 text-xs">{errors[field.id]}</p>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
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
        )}
    </>
  )
}

export default menu