import { useEffect } from "react"
import { getAllOrders } from "../../customerService"


function orders() {

    const fetchOrders = async() => {
        const response = await getAllOrders();
    };

    useEffect(() => {
        fetchOrders()
    },[]);
    return (
        <>
            <h1 className="text-2xl font-bold">Orders</h1>
        </>
    )
}

export default orders