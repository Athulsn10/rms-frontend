import { useEffect, useState } from "react";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Minus, Plus, Trash2 } from 'lucide-react';
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
type OrderStatus = 'Ordered' | 'Processing' | 'Completed' | 'Cancelled';

// Main order interface
interface Order {
    _id: string;
    restaurantId: string;
    userId: string;
    order: OrderItem[];
    tableNumber?: number;
    totalAmount: number;
    status: OrderStatus;
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
    const [originalOrder, setOriginalOrder] = useState<Order | null>(null);

    const handleEdit = (order: Order) => {
        setSelectedOrder(order);
        setOriginalOrder(order);
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
        const updatedOrder = { ...selectedOrder };
        const currentQuantity = updatedOrder.order[itemIndex].quantity;
        const newQuantity = Math.max(1, currentQuantity + change);

        updatedOrder.order[itemIndex].quantity = newQuantity;
        updatedOrder.totalAmount = updatedOrder.order.reduce((sum, item) => sum + item.quantity * parseFloat(item.menuId.price), 0);
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
            status: selectedOrder.status
        };

        // Call the update API
        const response = await updateOrder(selectedOrder._id, updatePayload);

        if (response) {
            fetchOrders()
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
            case 'Cancelled': return 'bg-red-100 text-red-800';
            case 'Ordered': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const fetchOrders = async () => {
        try {
            setFetchingData(true);
            const response = await getAllOrders();
            if (response) {
                setOrders(response);
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
                                <Card key={order._id} className="w-full">
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <CardTitle className="text-lg">
                                            Order #{order._id.slice(-6)}
                                        </CardTitle>
                                        <Badge className={getStatusColor(order.status)}>
                                            {order.status}
                                        </Badge>
                                    </CardHeader>

                                    <CardContent>
                                        <div className="space-y-2">
                                            <p className="text-sm text-gray-600">
                                                Date: {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                            <p className="font-medium">
                                                Total Amount: ₹{order.totalAmount}
                                            </p>

                                            <div className="flex gap-2 mt-4">
                                                <Button className="hover:bg-orange-100 rounded-none bg-transparent border-orange-400 hover:border-swiggyOrange border-2 text-swiggyOrange" onClick={() => handleEdit(order)} disabled={order.status === 'Cancelled'}>
                                                    Edit Order
                                                </Button>
                                                <Button className="rounded-none bg-orange-600 hover:bg-orange-500" onClick={() => handleCancel(order._id)} disabled={order.status === 'Cancelled'}>
                                                    Cancel Order
                                                </Button>
                                            </div>
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
                                                <p className="text-sm text-gray-600">${item.menuId.price} each</p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    onClick={() => handleQuantityChange(index, -1)}
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </Button>

                                                <span className="w-8 text-center">{item.quantity}</span>

                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    onClick={() => handleQuantityChange(index, 1)}
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>

                                                <Button
                                                    size="icon"
                                                    variant="destructive"
                                                    onClick={() => handleRemoveItem(index)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}

                                    <p className="font-medium text-right">
                                        Total: ₹{selectedOrder?.totalAmount}
                                    </p>
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
                    </>)}
            </div>
        </>
    );
}

export default Orders;
