import { useEffect, useState } from "react";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import toast, { Toaster } from 'react-hot-toast';
import { Textarea } from "@/components/ui/textarea";
import { CircleAlert, CircleCheck, Clock, Edit2, Loader2, Minus, Plus, Trash2, XCircle } from 'lucide-react';
import { getAllOrders, updateOrder } from "../../customerService";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

// Menu item interface
interface MenuItem {
    _id: string;
    name: string;
    price: string;
    type: 'VEGETARIAN' | 'NONE_VEGETARIAN';
    status: 'AVAILABLE' | 'UNAVAILABLE';
    images: string;
}

// Order item interface
interface OrderItem {
    menuId: MenuItem;
    quantity: number;
}

// Order status type
type OrderStatus = 'Ordered' | 'Preparing' | 'Completed' | 'Cancelled' | 'Delivered';

// Main order interface
interface Order {
    _id: string;
    restaurantId: string;
    userId: string;
    order: OrderItem[];
    tableNumber?: number;
    totalAmount: number;
    status: OrderStatus;
    remarks: String;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

// Order component
function Orders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [fetchingData, setFetchingData] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<any>();
    const [remarks, setRemarks] = useState(selectedOrder?.remarks || '');
    const [originalOrder, setOriginalOrder] = useState<Order | null>(null);

    const handleEdit = (order: Order) => {
        const orderCopy = JSON.parse(JSON.stringify(order));
        setSelectedOrder(orderCopy);
        setOriginalOrder(orderCopy);
        setIsEditModalOpen(true);
    };

    const handleCancel = (orderId: string) => {
        setOrders(prevOrders =>
            prevOrders.map(order =>
                order._id === orderId ? { ...order, status: 'Cancelled' } : order
            )
        );
    };

    const handleQuantityChange = (itemIndex: number, change: number) => {
        if (!selectedOrder) return;
        const updatedOrder = JSON.parse(JSON.stringify(selectedOrder));
        const currentQuantity = updatedOrder.order[itemIndex].quantity;
        const newQuantity = Math.max(1, currentQuantity + change);

        updatedOrder.order[itemIndex].quantity = newQuantity;
        updatedOrder.totalAmount = updatedOrder.order.reduce((sum:number, item:any) => sum + item.quantity * parseFloat(item.menuId.price), 0);
        setSelectedOrder(updatedOrder);
    };

    const handleRemoveItem = (itemIndex: number) => {
        if (!selectedOrder) return;
        const updatedOrder = { ...selectedOrder };
        updatedOrder.order = updatedOrder.order.filter((_: any, index: number) => index !== itemIndex);
        updatedOrder.totalAmount = updatedOrder.order.reduce((sum: number, item: any) => sum + item.quantity * parseFloat(item.menuId.price), 0);
        setSelectedOrder(updatedOrder);
    };

    const handleSaveChanges = async () => {
        const updatePayload = {
            restaurantId: selectedOrder.restaurantId,
            order: selectedOrder.order.map(item => ({
                menuId: item.menuId._id,
                quantity: item.quantity
            })),
            totalAmount: String(selectedOrder.totalAmount),
            tableNumber: String(selectedOrder.tableNumber),
            remarks: remarks,
            isPaid: selectedOrder.isPaid,
            status: selectedOrder.order.length == 0 ? "Cancelled" : selectedOrder.status
        };

        // Call the update API
        const response = await updateOrder(selectedOrder._id, updatePayload);

        if (response) {
            setIsEditModalOpen(false);
            toast.success('Order Updated!', {
              icon: <CircleCheck color="#1ce867" />,
            });
            fetchOrders();
        } else {
            setIsEditModalOpen(false);
            toast.error('Order Updated!', {
              icon: <CircleAlert color="#fc3419" />,
            });
        }
    };

    const handleModalClose = () => {
        if (originalOrder) {
            setSelectedOrder(originalOrder);
        }
        setIsEditModalOpen(false);
    };

    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case 'Cancelled': return 'bg-red-100 hover:bg-red-100 text-red-800';
            case 'Ordered': return 'bg-green-100 hover:bg-green-100 text-green-800';
            default: return 'bg-gray-100 hover:bg-gray-100 text-gray-800';
        }
    };

    const fetchOrders = async () => {
        try {
            setFetchingData(true);
            const response = await getAllOrders();
            if (response) {
                setOrders(response.reverse());
                setFetchingData(false);
            }
        } catch (error) {
            console.error("Failed to fetch orders", error);
            setFetchingData(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        setRemarks(selectedOrder?.remarks || '');
    }, [selectedOrder]);

    return (
        <>
            <div className="p-4 max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Order Management</h1>
                {fetchingData ? (
                    <div className='flex items-center justify-center h-96 text-orange-600'>
                        <Loader2 className="w-9 h-9 animate-spin" />
                    </div>) :
                    (<>
                        <div className="grid gap-4">
                            {orders.map((order) => (
                                <Card className="w-full transform transition-all duration-200 hover:shadow-lg border-none">
                                    <CardHeader className="pb-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                            <div className="flex flex-col gap-2">
                                                <CardTitle className="text-xl font-bold">
                                                    Order #{order._id.slice(-6)}
                                                </CardTitle>
                                                <div className="flex items-center gap-2 text-gray-500">
                                                    <Clock className="w-4 h-4" />
                                                    <span className="text-sm">
                                                        {new Date(order.createdAt).toLocaleDateString('en-GB', {
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            year: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                            <Badge className={`${getStatusColor(order.status)} px-4 py-1 text-sm font-medium rounded-full`}>
                                                {order.status}
                                            </Badge>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-6">
                                        <div className="flex flex-col gap-4">
                                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                <span className="text-gray-600">Total Amount</span>
                                                <span className="text-xl font-bold text-orange-600">₹{order.totalAmount}</span>
                                            </div>

                                            {(order.remarks && order.remarks !== "") && (
                                                <div className="p-4 bg-orange-50 rounded-lg">
                                                    <p className="text-sm text-gray-700">
                                                        <span className="font-medium">Message to chef:</span> {order.remarks.slice(-35)}<span>{order.remarks.length > 35 && "..."}</span>
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                            <Button
                                                variant="outline"
                                                className="flex-1 gap-2 rounded-none border-orange-400 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                                onClick={() => handleEdit(order)}
                                                disabled={order.status === 'Cancelled' || order.status === 'Delivered' || order.status === 'Preparing'}
                                            >
                                                <Edit2 className="w-4 h-4" />
                                                Edit Order
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                className="flex-1 gap-2 rounded-none bg-orange-600 hover:bg-orange-700"
                                                onClick={() => handleCancel(order._id)}
                                                disabled={order.status === 'Cancelled' || order.status === 'Delivered' || order.status === 'Preparing'}
                                            >
                                                <XCircle className="w-4 h-4" />
                                                Cancel Order
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        <Dialog open={isEditModalOpen} onOpenChange={handleModalClose}>
                            <DialogContent className="max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Edit Order #{selectedOrder?._id.slice(-6)}</DialogTitle>
                                </DialogHeader>

                                <div className="space-y-4">
                                    {selectedOrder?.order.map((item: any, index: number) => (
                                        <div key={item.menuId._id} className="flex items-center justify-between p-2 border rounded">
                                            <div>
                                                <p className="font-medium">{item.menuId.name}</p>
                                                <p className="text-sm text-gray-600">₹{item.menuId.price} each</p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Button size="icon" variant="outline" onClick={() => handleQuantityChange(index, -1)}>
                                                    <Minus className="h-4 w-4" />
                                                </Button>
                                                <span className="w-8 text-center">{item.quantity}</span>
                                                <Button size="icon" variant="outline" onClick={() => handleQuantityChange(index, 1)}>
                                                    <Plus className="h-4 w-4" />
                                                </Button>

                                                <Button size="icon" variant="destructive" onClick={() => handleRemoveItem(index)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}

                                    <p className="font-medium text-right">
                                        Total: ₹{selectedOrder?.totalAmount}
                                    </p>
                                    <Textarea placeholder="Type your message here." value={remarks}  onChange={(e) => setRemarks(e.target.value)}/>
                                </div>

                                <DialogFooter>
                                    <Button className="hover:bg-orange-100 rounded-none bg-transparent border-orange-400 hover:border-swiggyOrange border-2 text-swiggyOrange" onClick={handleModalClose}>
                                        Cancel
                                    </Button>
                                    <Button className="rounded-none bg-orange-600 hover:bg-orange-500" onClick={handleSaveChanges}>
                                        Save Changes
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <Toaster />
                    </>)}
            </div>
        </>
    );
}

export default Orders;
