import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from 'react-hot-toast';
import RestaurantRating from "./restaurantRating";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getRestuarantById, placeOrder, handleImageSearch } from "./customerService";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Circle, CircleAlert, CircleCheck, Upload, Loader2, Minus, Plus, Search, ShoppingCart, Triangle, TriangleAlert, Utensils, UtensilsCrossed, Flame, ScanQrCode, Star } from "lucide-react";


function restuarant() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [preview, setPreview] = useState('');
  const [remarks, setRemarks] = useState('');
  const [menuList, setMenuList] = useState([]);
  const [hasMenu, setHasMenu] = useState(false);
  const [results, setResults] = useState<any>([]);
  const [searchItem, setSearchitem] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cartItems, setCartItems] = useState<any>([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fetchingData, setFetchingData] = useState(false);
  const [originalMenuList, setOriginalMenuList] = useState([]);
  const [isEditModalOpen, setIsRemarksModalOpen] = useState(false);
  const base_url = import.meta.env.VITE_BASE_URL;
  const idFromParams = searchParams.get('id');

  const fetchData = async () => {
    setFetchingData(true);
    if (idFromParams) {
      localStorage.removeItem('restaurantOrder');
      const response = await getRestuarantById(idFromParams);
      if (response && response.length > 0) {
        setMenuList(response);
        setOriginalMenuList(response);
        setHasMenu(true);
        setFetchingData(false);
      } else {
        setFetchingData(false);
      }
    } else {
      const restuatantId = localStorage.getItem('restaurantOrder');
      if (restuatantId) {
        const parsedValue = JSON.parse(restuatantId);
        const response = await getRestuarantById(parsedValue.restaurantId);
        if (response && response.length > 0) {
          setMenuList(response);
          setHasMenu(true);
          setFetchingData(false);
        } else {
          setFetchingData(false);
        }
      }
    }
  };

  const formatIngredients = (ingredients: string[]) => {
    return ingredients.map((ingredient: string) =>
      ingredient.split('_').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
    ).join(', ');
  };

  const updateQuantity = (item: any, delta: number) => {
    const menuId = item._id;
    setCartItems((prev: any) => {
      // Find if item already exists in cart
      const existingItemIndex = prev.findIndex((item: any) => item.menuId === menuId);
      const newCart = [...prev];

      if (existingItemIndex !== -1) {
        // Update existing item
        const newQuantity = Math.max(0, newCart[existingItemIndex].quantity + delta);
        if (newQuantity === 0) {
          // Remove item if quantity becomes 0
          newCart.splice(existingItemIndex, 1);
        } else {
          newCart[existingItemIndex] = {
            menuId,
            quantity: newQuantity
          };
        }
      } else if (delta > 0) {
        // Add new item
        newCart.push({
          menuId,
          quantity: 1
        });
      }

      return newCart;
    });
  };

  const handlePlaceOrder = async () => {
    const resturant = localStorage.getItem('restaurantOrder');
    if (resturant) {
      const parsedRestuarant = JSON.parse(resturant);
      const restaurantId = parsedRestuarant.restaurantId;
      const tableName = parsedRestuarant.tableName;
      const orderObject = {
        isPaid: false,
        restaurantId: String(restaurantId),
        order: cartItems,
        totalAmount: String(totalAmount),
        tableNumber: tableName,
        status: "Ordered",
        remarks: remarks
      };
      const response = await placeOrder(orderObject);
      if (response) {
        setIsRemarksModalOpen(false);
        toast.success('Order Placed!', {
          icon: <CircleCheck color="#1ce867" />,
        });
        setRemarks('');
        setCartItems([]);
      } else {
        setIsRemarksModalOpen(false);
        toast.error('Order not palced due a error!', {
          icon: <CircleAlert color="#fc3419" />,
        });
      }
    }
  };

  const getQuantity = (menuId: string) => {
    const item = cartItems.find((item: any) => item.menuId === menuId);
    return item ? item.quantity : 0;
  };

  const handleFileSelect = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader: any = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    let restaurantId;
    const resturant = localStorage.getItem('restaurantOrder');

    if (!selectedFile) {
      toast.error('Something went wrong!', {
        icon: <CircleAlert color="#fc3419" />,
      });
      setIsLoading(false);
      return;
    }

    if (resturant) {
      const parsedRestuarant = JSON.parse(resturant);
      restaurantId = parsedRestuarant.restaurantId;
    } else if (idFromParams) {
      restaurantId = idFromParams;
    } else {
      toast.error('Something went wrong!', {
        icon: <CircleAlert color="#fc3419" />,
      });
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('restaurantId', restaurantId);
    formData.append('image', selectedFile);
    const response = await handleImageSearch(formData);
    if (response) {
      setResults(response);
      setIsLoading(false);
    } else {
      toast.error('Something went wrong!', {
        icon: <CircleAlert color="#fc3419" />,
      });
      setIsLoading(false);
    }
  };

  const handleMenuSearch = () => {
    if (!searchItem) {
      setMenuList(originalMenuList);
      return;
    }
  
    const filteredMenu = originalMenuList.filter((menu: any) =>
      menu.name.toLowerCase().includes(searchItem.toLowerCase())
    );
  
    setMenuList(filteredMenu);
  };

  useEffect(() => {
    const total = cartItems.reduce((sum: number, cartItem: any) => {
      const menuItem: any = menuList.find((item: any) => item._id === cartItem.menuId);
      return sum + (parseFloat(menuItem?.price || 0) * cartItem.quantity);
    }, 0);
    setTotalAmount(total);
  }, [cartItems]);

  useEffect(() => {
    fetchData()
  }, []);

  return (
    <>
      {
        fetchingData ? (
          <div className='flex items-center justify-center h-96 mt-28 text-orange-600'>
            <Loader2 className="w-9 h-9 animate-spin" />
          </div>) :
          (<>
            {!hasMenu ? (
              <>
                <div className="flex items-center justify-center w-100 h-96 mt-16">
                  <div className="md:w-[700px] h-96 bg-red-50">
                    <div className="flex flex-col items-center justify-center h-full text-center p-6 ">
                      <div className="bg-red-100 p-4 rounded-full mb-4 cursor-pointer">
                        <TriangleAlert size={48} className="text-red-500 animate-[pulse_1000ms_ease-in-out_infinite]" />
                      </div>
                      <p className="text-gray-700 mb-4">
                        Restuarant has no menus yet!<br />
                        Kindly ask the management for more details
                      </p>
                    </div>
                  </div>
                </div>
              </>) :
              (<>
                <div className="w-100 flex justify-center bg-orange-100 ">
                  <div className="flex flex-col p-4 md:flex-row items-center justify-between gap-4 md:gap-16 w-full max-w-7xl">
                    <Button className="flex items-center bg-orange-200 rounded-none w-100 md:w-50 hover:bg-orange-200 px-5 py-5" onClick={() => setDialogOpen(true)}>
                      <Search size={28} className="text-orange-500" />
                      <p className="font-bold text-orange-500 text-xl">Search Image</p>
                    </Button>

                    <div className="flex items-center w-full md:w-auto justify-center">
                      <div className="relative w-full md:w-[700px]">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input onChange={(e) => {setSearchitem(e.target.value)}} onKeyDown={(e) => { if (e.key === "Enter") { handleMenuSearch() }}} className="font-medium w-full py-5 rounded-none" placeholder="Search Menu Item" />
                      </div>
                      <Button onClick={() => handleMenuSearch()} className="flex ml-2 md:ml-4 items-center bg-orange-200 rounded-none hover:bg-orange-200 px-5 py-5">
                        <Search size={28} className="text-orange-500" />
                        <p className="font-bold text-orange-500 text-xl hidden md:inline">Search</p>
                      </Button>
                      <RestaurantRating idFromParams={idFromParams} />
                    </div>
                  </div>
                  <Dialog open={dialogOpen} onOpenChange={() => setDialogOpen(false)}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Upload A Food Image</DialogTitle>
                      </DialogHeader>
                      {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center z-20">
                          <div className="inline-block transition-all duration-300">
                            <img style={{ height: '60px' }} src="/ai-loading-2.gif" />
                          </div>
                        </div>
                      )}
                      <div className={`${isLoading ? 'blur-sm pointer-events-none space-y-6' : 'space-y-6'}`}>
                        {/* Upload Section */}
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-full max-w-md aspect-video bg-slate-100 rounded-none border-2 border-dashed border-orange-300 hover:border-orange-400 transition-colors relative overflow-hidden">
                            {preview ? (
                              <img
                                src={preview}
                                alt="Preview"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                                <Upload size={32} />
                                <p className="mt-2 text-sm text-center">Click or drag image to upload and<br/>get a similiar item from the menu</p>
                              </div>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileSelect}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                          </div>

                          <Button
                            onClick={handleSubmit}
                            disabled={!selectedFile || isLoading}
                            className="w-full max-w-md rounded-none bg-orange-600 hover:bg-orange-500"
                          >Analyze Image
                          </Button>
                        </div>

                        {/* Results Section */}
                        {results.length > 0 && 
                          (<ScrollArea className="h-[250px] w-full rounded-md border">
                            <div className="space-y-6 p-4">
                              {results.map((result: any) => (
                                <div key={result._id} className="rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md overflow-hidden">
                                  <div className="flex flex-col md:flex-row w-full">
                                    <div className="relative w-full md:w-72 h-48 md:h-auto">
                                      <img
                                        src={`${base_url}files/menus/${result.images}`}
                                        alt={result.name}
                                        className="w-full h-full object-cover"/>
                                    </div>

                                    {/* Content section */}
                                    <div className="flex-1 p-4 md:p-6">
                                      <div className="space-y-4">
                                        {/* Header section */}
                                        <div className="flex items-start justify-between">
                                          <div className="space-y-1">
                                            <h3 className="text-lg md:text-xl font-semibold text-slate-900">{result.name}</h3>
                                            <p className="text-sm text-slate-500">{result.calories} calories</p>
                                          </div>
                                          <div
                                            className={`p-2 rounded-full ${result.type === "VEGETARIAN"
                                                ? "bg-green-100 text-green-600"
                                                : "bg-red-100 text-red-600"
                                              }`}>
                                            {result.type === "VEGETARIAN" ? <Circle className="h-5 w-5" /> : <Triangle className="h-5 w-5" />}
                                          </div>
                                        </div>

                                        {/* Price and controls section */}
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                          <div className="flex items-center gap-2">
                                            <Badge
                                              variant="outline"
                                              className={`${result.status === 'AVAILABLE'
                                                  ? "bg-green-50 text-green-700 border-green-200"
                                                  : "bg-red-50 text-red-700 border-red-200"
                                                }`}>
                                              {result.status}
                                            </Badge>
                                            <span className="font-medium text-lg text-slate-900">₹{result.price}</span>
                                          </div>

                                          {!idFromParams && (
                                            <div className="flex items-center gap-2">
                                              <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8 bg-orange-50 border-orange-200 hover:bg-orange-100"
                                                onClick={() => updateQuantity(result, -1)}
                                                disabled={!getQuantity(result._id)}>
                                                <Minus className="h-4 w-4" />
                                              </Button>
                                              <span className="w-8 text-center font-medium">
                                                {getQuantity(result._id)}
                                              </span>
                                              <Button
                                                variant="outline"
                                                size="icon"
                                                disabled={result.status === 'UNAVAILABLE'}
                                                className="h-8 w-8 bg-orange-50 border-orange-200 hover:bg-orange-100"
                                                onClick={() => updateQuantity(result, 1)}>
                                                <Plus className="h-4 w-4" />
                                              </Button>
                                            </div>
                                          )}
                                        </div>

                                        {/* Ingredients section */}
                                        <div className="space-y-2">
                                          <h4 className="font-medium text-slate-700">Ingredients:</h4>
                                          <div className="flex flex-wrap gap-2">
                                            {result.ingredients.map((ingredient: any, idx: number) => (
                                              <span key={idx} className="px-3 py-1 rounded-full text-sm bg-slate-50 text-slate-600 border border-slate-200">
                                                {ingredient.replace(/_/g, ' ')}
                                              </span>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>)}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className={`grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6 p-6 ${cartItems.length  > 0  || idFromParams ? 'mb-16' : ''}`}>
                  {menuList.map((item: any) => (
                    <Card key={item._id} className="w-full">
                      <div className="relative h-48 w-full overflow-hidden">
                        <img
                          src={`${base_url}files/menus/${item.images}`}
                          alt={item.name}
                          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                        />
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              size="sm"
                              className="absolute top-2 right-2 bg-orange-100 hover:bg-orange-100 rounded-full px-2 group">
                              <div className="flex items-center justify-end overflow-hidden rounded-full transition-all duration-300">
                                <div className="flex items-center">
                                  <div className="max-w-0 overflow-hidden whitespace-nowrap transition-all duration-300 group-hover:max-w-xs">
                                    <img
                                      style={{ height: '20px' }}
                                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Google_Bard_logo.svg/900px-Google_Bard_logo.svg.png"
                                      className="text-orange-600"
                                      alt="Bard Logo"
                                    />
                                  </div>
                                  <div className="p-1">
                                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                                  </div>
                                </div>
                              </div>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <div className="flex items-start gap-2">
                              <img
                                style={{ height: '20px' }}
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Google_Bard_logo.svg/900px-Google_Bard_logo.svg.png"
                                className="text-orange-600 animate-[pulse_2000ms_ease-in-out_infinite]"
                              />
                              <p className="text-sm">{item.allergens.description}</p>
                            </div>
                          </PopoverContent>
                        </Popover>
                        <div className="absolute top-14 right-2 group">
                          <div className="flex items-center justify-end bg-orange-100 rounded-full overflow-hidden transition-all duration-300">
                            <div className="flex items-center">
                              <p className="max-w-0 overflow-hidden whitespace-nowrap transition-all duration-300 group-hover:max-w-xs group-hover:pl-2">
                                {item.calories} Calories
                              </p>
                              <div className="p-2">
                                <Flame className="w-5 h-5 text-yellow-600" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl font-bold">{item.name}</CardTitle>
                            <CardDescription className="mt-2 font-semibold">
                              ₹{item.price}
                            </CardDescription>
                          </div>
                          <div className={`${item.type === "VEGETARIAN" ? "bg-green-600 text-white hover:bg-green-600 p-2 rounded-sm" : "bg-red-600 hover:bg-red-600 text-white p-2 rounded-sm"}`}>
                            {item.type === "VEGETARIAN" ? <Circle /> : <Triangle />}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-gray-500 mb-4 h-20">
                          <strong>Ingredients:</strong> {formatIngredients(item.ingredients)}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between items-center">
                        <Badge variant="outline" className={`${item.status === 'AVAILABLE' ? "bg-green-200" : "bg-red-200"} `}>
                          {item.status}
                        </Badge>
                       { !idFromParams && 
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-orange-100 rounded-none hover:bg-orange-200"
                            onClick={() => updateQuantity(item, -1)}
                            disabled={!getQuantity(item._id)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-medium">
                            {getQuantity(item._id)}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            disabled={item.status === 'UNAVAILABLE'}
                            className="h-8 w-8 bg-orange-100 rounded-none hover:bg-orange-200"
                            onClick={() => updateQuantity(item, 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                       }
                      </CardFooter>
                    </Card>
                  ))}
                </div>
                {cartItems.length > 0 && (
                  <div className="fixed bottom-16 md:bottom-0 left-0 right-0 bg-white border-t shadow-lg p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-center sm:bottom-10 space-y-3 sm:space-y-0">
                    <div className="flex items-center gap-4 w-full sm:w-auto justify-center sm:justify-start">
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5 text-gray-600" />
                        <span className="font-medium">
                          {cartItems.reduce((total: string, item: any) => total + item.quantity, 0)} items
                        </span>
                      </div>
                      <div className="text-lg font-bold">
                        ₹{totalAmount.toFixed(2)}
                      </div>
                    </div>
                    <div className="flex gap-2 sm:gap-5 w-full sm:w-auto">
                      <Button
                        onClick={() => setCartItems([])}
                        className="flex-1 sm:flex-none bg-transparent border-orange-400 hover:border-orange-500 text-orange-400 px-4 sm:px-8 py-2 sm:py-3 rounded-none border-2 hover:bg-orange-100 text-sm sm:text-base"
                      >
                        Reset <UtensilsCrossed color="#ea580c" className="ml-2" />
                      </Button>
                      <Button
                        onClick={() => setIsRemarksModalOpen(true)}
                        className="flex-1 sm:flex-none bg-orange-600 hover:bg-orange-700 text-white px-4 sm:px-8 py-2 sm:py-3 rounded-none text-sm sm:text-base"
                      >
                        Continue <Utensils color="#ffff" className="ml-2" />
                      </Button>
                    </div>
                  </div>
                )}

                {idFromParams && 
                   (<div className="fixed bottom-16 md:bottom-0 left-0 right-0 bg-white border-t shadow-lg p-3 sm:p-4 flex flex-col sm:flex-row justify-end items-center sm:bottom-10 space-y-3 sm:space-y-0">
                    <div className="flex gap-2 sm:gap-5 w-full sm:w-auto items-center">
                    <p className="ms-10 font-semibold">Scan the qr code to place orders!</p>
                      <Button
                        onClick={() => navigate('/qrscanner')}
                        className="flex-1 sm:flex-none bg-orange-600 hover:bg-orange-700 text-white px-4 sm:px-8 py-2 sm:py-3 rounded-none text-sm sm:text-base"
                      >
                        Scan Qr <ScanQrCode color="#ffff" className="ml-2" />
                      </Button>
                    </div>
                  </div>)
                }
              </>
              )
            }

            <Dialog open={isEditModalOpen} onOpenChange={() => setIsRemarksModalOpen(false)}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex">Message To The Chef</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  <Textarea placeholder="Type your message here." onChange={(e) => setRemarks(e.target.value)} />
                </div>

                <DialogFooter>
                  <Button className="hover:bg-orange-100 rounded-none bg-transparent border-orange-400 hover:border-swiggyOrange border-2 text-swiggyOrange" onClick={() => setIsRemarksModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="rounded-none bg-orange-600 hover:bg-orange-500" onClick={handlePlaceOrder}>
                    Place Order
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Toaster />
          </>)
      }
    </>
  )
}

export default restuarant