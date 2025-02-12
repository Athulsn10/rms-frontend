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
import { Circle, CircleAlert, CircleCheck, CircleX, Flame, ImageIcon, IndianRupee, Loader2, Pencil, Plus, Search, ShoppingBasket, Soup, Trash2, Triangle, Vegan, X } from "lucide-react";

interface Menu {
  dishName: string;
  image: File | null;
  isVeg: boolean | string;
  ingredients: string[];
  price: number | undefined;
  calories: number | undefined;
};

function menu() {
  const [isVeg, setIsVeg] = useState(true);
  const [preview, setPreview] = useState<any>();
  const [hasMenu, setHasMenu] = useState(false);
  const [editItemId, setEditItemId] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [menuList, setMenuList] = useState<any[]>([]);
  const [multiSelectKey, setMultiSelectKey] = useState(0);
  const [fetchingData, setFetchingData] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [calories, setCalories] = useState<number | undefined>(undefined);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [menu, setMenu] = useState<Menu>({
    dishName: '',
    image: null,
    isVeg: true,
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
      placeholder: 'Enter Dish Name',
      icon: Soup,
      required: true,
      validation: (value: string) => !value ? 'Dish name is required' : ''
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
      id: 'image',
      label: 'Image',
      type: 'file',
      placeholder: 'Upload item image',
      icon: 'none',
      required: !isEditMode,
      validation: (value: string) => !value && !isEditMode ? 'Image is required' : ''
    },
    {
      id: 'isVeg',
      label: 'Veg or Non Veg',
      type: 'toggle',
      placeholder: 'Mutton Soup',
      icon: Vegan,
      required: true,
      validation: () => ''
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
      let value;
      if (field.id === 'calories') {
        value = calories
      } else if (field.id === 'image') {
        value = fileInputRef.current?.value;
      } else {
        value = (menu as any)[field.id]
      }
      const error = field.validation(value?.toString() || '');

      if (error) {
        newErrors[field.id] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleImageUpload = async (value: File) => {
    setAiLoading(true);
    try {
      const aiResult = await imageUpload(value);
      if (aiResult) {
        setSelectedIngredients(aiResult.ingredients);
        setCalories(aiResult.calories);
        setMenu(prev => ({
          ...prev,
          calories: aiResult.calories,
          ingredients: aiResult.ingredients
        }));
      } else {
        toast.error('AI failed to fetch ingredients!', {
          icon: <CircleX color="#fc3419" />,
        });
      }
    } catch (error) {
      toast.error('Error uploading image', {
        icon: <CircleX color="#fc3419" />,
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleFileChange = async (e: any) => {
    const file = e.target.files[0];
    await handleImageUpload(file);
    if (file) {
      const reader: any = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  const handleInputChange = (id: string, value: string | number) => {
    if (id === 'calories') {
      setCalories(Number(value));
      setMenu(prev => ({ ...prev, calories: Number(value) }));
    } else {
      setMenu(prev => ({
        ...prev,
        [id]: id === 'price' ? Number(value) : value
      }));
    }

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

      try {
        const formData = new FormData();
        formData.append('name', menu.dishName);

        // Only append image if it's a new item or image is selected in edit mode
        if (!isEditMode || (fileInputRef.current && fileInputRef.current.files?.[0])) {
          if (!fileInputRef.current?.files?.[0]) {
            toast.error('Please select an image file', {
              icon: <CircleAlert color="#fc3419" />,
            });
            setIsLoading(false);
            return;
          }
          formData.append('image', fileInputRef.current.files[0]);
        }

        formData.append('type', isVeg ? 'VEGETARIAN' : 'NONE_VEGETARIAN');
        formData.append('price', menu.price?.toString() || '');
        formData.append('status', 'AVAILABLE');
        formData.append('calories', calories?.toString() || '');

        selectedIngredients.forEach((ingredient) => {
          formData.append(`ingredients`, ingredient);
        });

        const response = isEditMode
          ? await editMenu(editItemId, formData)
          : await createMenu(formData);

        if (response) {
          toast.success(`Menu item ${isEditMode ? "modified" : "created"}`, {
            icon: <CircleCheck color="#1ce867" />,
          });
          fetchMenus();
          setIsFormVisible(false);
          resetForm();
        } else {
          toast.error('Something went wrong!', {
            icon: <CircleAlert color="#fc3419" />,
          });
        }
      } catch (error) {
        toast.error('Error saving menu item', {
          icon: <CircleAlert color="#fc3419" />,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const resetForm = () => {
    setMenu({
      dishName: '',
      image: null,
      isVeg: true,
      ingredients: [],
      price: undefined,
      calories: undefined
    });
    setPreview(null);
    setSelectedIngredients([]);
    setIsEditMode(false);
    setEditItemId("");
    setErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setCalories(undefined);
  };

  const handleMenuDelete = async (itemId: string) => {
    try {
      const response = await deleteMenu(itemId);
      if (response) {
        toast.success('Menu item deleted', {
          icon: <CircleCheck color="#1ce867" />,
        });
        setMenuList(prevItems => prevItems.filter((item: any) => item._id !== itemId));
      } else {
        toast.error('Failed to delete, please try again', {
          icon: <CircleX color="#fc3419" />,
        });
      }
    } catch (error) {
      toast.error('Error deleting menu item', {
        icon: <CircleX color="#fc3419" />,
      });
    }
  };

  const handleMenuEdit = async (itemId: string) => {
    const selectedItem: any = menuList.find((item: any) => item._id === itemId);
    if (selectedItem) {
      setIsEditMode(true);
      setEditItemId(itemId);
      setMenu({
        dishName: selectedItem.name,
        image: null,
        isVeg: selectedItem.type === 'VEGETARIAN',
        ingredients: selectedItem.ingredients,
        price: selectedItem.price,
        calories: selectedItem.calories
      });
      setIsVeg(selectedItem.type === 'VEGETARIAN');
      setPreview(`${base_url}files/menus/${selectedItem.images}`)
      setSelectedIngredients(selectedItem.ingredients);
      setCalories(selectedItem.calories);
      setIsFormVisible(true);
    }
  };

  const fetchMenus = async () => {
    setFetchingData(true);
    try {
      const menuItems = await getMenus();
      if (menuItems.length > 0) {
        setMenuList(menuItems);
        setHasMenu(true);
      } else {
        setHasMenu(false);
      }
    } catch (error) {
      toast.error('Error fetching menus', {
        icon: <CircleX color="#fc3419" />,
      });
    } finally {
      setFetchingData(false);
    }
  };

  const handleRemovePreview = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSearch = () => {
    const filteredMenus = menuList.filter(item =>
      item.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setMenuList(filteredMenus);
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    resetForm();
  };

  const showAddForm = () => {
    setIsFormVisible(true);
    setIsEditMode(false);
    resetForm();
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  useEffect(() => {
    setMultiSelectKey(multiSelectKey + 1);
  }, [selectedIngredients]);

  useEffect(() => {
    if (!dialogOpen) {
      resetForm();
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
            {isFormVisible ? (
              <div className="w-full max-w-4xl mx-auto p-6 bg-white">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {isEditMode ? 'Edit Menu Item' : 'Add Menu Item'}
                  </h2>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="bg-swiggyOrange hover:bg-orange-500 text-white hover:text-white text-sm rounded-none"
                  >
                    Cancel
                  </Button>
                </div>

                {aiLoading && (
                  <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/50">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Google_Bard_logo.svg/900px-Google_Bard_logo.svg.png"
                      alt="Loading"
                      className="h-16 animate-pulse"
                    />
                  </div>
                )}

                <div className={`${aiLoading ? 'opacity-30' : ''}`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formFields.map((field, index) => (
                      <div
                        key={index}
                        className={`
                          space-y-1 
                          ${field.id === "ingredients" ? "md:col-span-2" : ""}
                          ${field.type === "file" ? "md:col-span-2" : ""}
                        `}
                      >
                        <Label
                          htmlFor={field.id}
                          className="text-xs font-medium text-gray-700 block"
                        >
                          {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </Label>

                        {field.id === "ingredients" && (
                          <div>
                            <MultiSelect
                              key={multiSelectKey}
                              className="w-full rounded-md border-gray-300"
                              options={ingredientsList}
                              defaultValue={selectedIngredients}
                              onValueChange={setSelectedIngredients}
                              placeholder="Select Ingredients"
                              variant="rmscolor"
                              animation={2}
                              maxCount={5}
                            />
                            <div style={{ height: '6px', marginTop: '2px', display: 'flex', justifyContent: 'end', width: '100%' }}>
                              {errors[field.id] && (
                                <p className="text-red-500 text-xs">{errors[field.id]}</p>
                              )}
                            </div>
                          </div>
                        )}

                        {field.type === "toggle" && (
                          <div>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                className={`
                                  flex-1 text-xs py-2
                                  ${isVeg ? "bg-green-600 hover:bg-green-600 text-white rounded-none" : "bg-green-200 hover:bg-green-200 text-green-600 rounded-none"}
                                `}
                                onClick={() => setIsVeg(true)}
                              >
                                <Circle className="mr-1 h-4 w-4" /> Veg
                              </Button>
                              <Button
                                type="button"
                                className={`
                                  flex-1 text-xs py-2
                                  ${!isVeg ? "bg-red-600 hover:bg-red-600 text-white rounded-none" : "bg-red-200 text-red-600 hover:bg-red-200 rounded-none"}
                                `}
                                onClick={() => setIsVeg(false)}
                              >
                                <Triangle className="mr-1 h-4 w-4" /> Non-Veg
                              </Button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Default is set to Veg. Modify if needed!
                            </p>
                          </div>
                        )}

                        {field.type === "file" && (
                          <div>
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
                                flex items-center justify-center 
                                border-2 border-dashed rounded-none p-4 
                                cursor-pointer hover:border-blue-500 
                                transition min-h-[180px] relative
                                ${preview ? 'border-transparent' : 'border-gray-300'}
                              `}
                            >
                              {preview ? (
                                <>
                                  <img
                                    src={preview}
                                    alt="Preview"
                                    className="max-h-[145px] max-w-full object-cover rounded-lg"
                                  />
                                  <Button
                                    size="icon"
                                    variant="destructive"
                                    className="absolute top-2 right-2 rounded-full"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleRemovePreview();
                                    }}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </>
                              ) : (
                                <div className="flex flex-col items-center">
                                  <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                                  <span className="text-gray-600 text-sm">
                                    Click to Upload Image
                                  </span>
                                </div>
                              )}
                            </Label>
                          </div>
                        )}

                        {field.type !== "toggle" && field.type !== "file" && field.id !== "ingredients" && (
                          <div className="relative">
                            {field.icon && (
                              <field.icon className="absolute left-3 top-1/2 -translate-y-[73%] h-4 w-4 text-gray-500" />
                            )}
                            <Input
                              id={field.id}
                              type={field.type}
                              value={field.id === 'calories' ? calories : (menu as any)[field.id]}
                              placeholder={field.placeholder}
                              onChange={(e) => handleInputChange(field.id, e.target.value)}
                              className={`
                                pl-8 py-4 w-full rounded-none
                                border-gray-300 focus:border-blue-500
                                text-sm
                                ${field.icon ? 'pl-8' : ''}
                              `}
                            />
                            <div style={{ height: '6px', marginTop: '2px', display: 'flex', justifyContent: 'end', width: '100%' }}>
                              {errors[field.id] && (
                                <p className="text-red-500 text-xs">{errors[field.id]}</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <Button
                    disabled={isLoading}
                    onClick={handleMenuSave}
                    className="w-full bg-swiggyOrange hover:bg-orange-500 py-2 text-sm rounded-none"
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      'Save'
                    )}
                  </Button>
                </div>
              </div>
            ) :
              (<>
                {!hasMenu ? (
                  <div className="flex items-center w-100 justify-center md:h-[100%]">
                    <Card className="md:w-[700px] h-96 bg-red-50">
                      <CardContent className="flex flex-col items-center justify-center h-full text-center p-6 ">
                        <div onClick={showAddForm}>
                          <div className="bg-red-100 p-4 rounded-full mb-4 cursor-pointer">
                            <Plus size={48} className="text-red-500" />
                          </div>
                        </div>
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
                        <Button className="flex items-center bg-orange-200 rounded-none w-100 md:w-50 hover:bg-orange-200 px-5 py-5" onClick={showAddForm}>
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
                              <Badge>
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
              </>
              )
            }
            <Toaster />
          </>
        )}
    </>
  )
}

export default menu