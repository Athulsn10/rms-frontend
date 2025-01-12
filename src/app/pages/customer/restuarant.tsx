import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"
import { getRestuarantById, placeOrder } from "./customerService";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ChefHat, Circle, CircleAlert, CircleCheck, Loader2, Minus, Plus, ShoppingCart, Triangle, TriangleAlert, Utensils, UtensilsCrossed } from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';

function restuarant() {
  const [remarks, setRemarks] = useState('');
  const [menuList, setMenuList] = useState([]);
  const [hasMenu, setHasMenu] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [cartItems, setCartItems] = useState<any>([]);
  const [fetchingData, setFetchingData] = useState(false);
  const [isEditModalOpen, setIsRemarksModalOpen] = useState(false);
  const base_url = import.meta.env.VITE_BASE_URL;

  const fetchData = async () => {
    setFetchingData(true);
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
      } else {
        setIsRemarksModalOpen(false);
        toast.error('Order not palced due a error!', {
          icon: <CircleAlert color="#1ce867" />,
        });
      }
    }
  };

  const getQuantity = (menuId: string) => {
    const item = cartItems.find((item: any) => item.menuId === menuId);
    return item ? item.quantity : 0;
  };

  useEffect(() => {
    const total = cartItems.reduce((sum:number, cartItem:any) => {
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
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6 p-6">
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
                              size="icon"
                              className="absolute top-2 right-2 bg-white hover:bg-white"
                            >
                              <AlertCircle className="w-5 h-5 text-yellow-500" />
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
                        <Badge variant="outline" className="mr-2">
                          {item.status}
                        </Badge>
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
                            className="h-8 w-8 bg-orange-100 rounded-none hover:bg-orange-200"
                            onClick={() => updateQuantity(item, 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
                {cartItems.length > 0 && (
                  <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
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
                    <div className="flex gap-5">
                      <Button
                        onClick={() => setCartItems([])}
                        className="bg-transparent border-orange-400 hover:border-orange-500 text-orange-400 px-8 py-3 rounded-none border-2 hover:bg-orange-100"
                      >
                        Reset <UtensilsCrossed color="#ea580c" />
                      </Button>
                      <Button
                        onClick={() => setIsRemarksModalOpen(true)}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-none"
                      >
                        Continue <Utensils color="#ffff" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
              )
            }

            <Dialog open={isEditModalOpen} onOpenChange={() => setIsRemarksModalOpen(false)}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex">Message To The Chef</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                <Textarea placeholder="Type your message here." onChange={(e) => setRemarks(e.target.value)}/>
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