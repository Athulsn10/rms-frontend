import { useEffect } from "react";
import { useState } from 'react';
import OrderModal from "./orderModal";
import { Button } from "@/components/ui/button";
import { Clock, Edit2, Eye } from 'lucide-react';
import { getAllOrders } from "./restuarantService";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


function Orders() {
  const [orders, setOrder] = useState<any>([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const statusColors: any = {
    Ordered: 'bg-yellow-100 text-yellow-800',
    Preparing: 'bg-blue-100 text-blue-800',
    Completed: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800'
  };

  const fetchOrders = async () => {
    const response = await getAllOrders();
    if (response) {
      setOrder(response.reverse());
    }
  }
  useEffect(() => {
    fetchOrders();
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {orders.map((order:any) => (
        <Card key={order._id} className="w-full border-none">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-medium">Table {order.tableNumber}</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-500 mt-1">
                    <Clock className="h-4 w-4" />
                    <span>{formatDate(order.createdAt)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex space-x-5">
                  {/* view */}
                  <Dialog >
                    <DialogTrigger>
                      <Button className="hover:bg-orange-100 rounded-none bg-transparent border-orange-400 hover:border-swiggyOrange border-2 text-swiggyOrange">
                        <Eye className="h-4 w-4" />Open
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Order Details</DialogTitle>
                      </DialogHeader>
                      <OrderModal order={order} />
                    </DialogContent>
                  </Dialog>
                  {/* Edit */}
                  <Dialog>
                    <DialogTrigger>
                      <Button className="flex-1 gap-2 rounded-none bg-orange-600 hover:bg-orange-700">
                        <Edit2 className="w-4 h-4"/> Edit Status
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Update Order Status</DialogTitle>
                      </DialogHeader>
                      <div className="py-4">
                        <Select defaultValue={order.status}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Ordered">Ordered</SelectItem>
                            <SelectItem value="Preparing">Preparing</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t bg-orange-50">
            <div className="w-full mt-4">
              {order.remarks && (
                <p className="text-sm text-gray-600 italic">Note: {order.remarks.slice(-35)} <span>{order.remarks.length > 35 && "..."}</span></p>
              )}
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm font-medium">Total</span>
                <span className="text-lg font-semibold">₹{order.totalAmount}</span>
              </div>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

export default Orders;