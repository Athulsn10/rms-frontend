import axios from 'axios';
import { http } from '../../../services/http';

export const getUserDetail = async () => {
    try {
        const customerId = localStorage.getItem('id');
        const response = await http.get(`/customer/${customerId}`);
        localStorage.setItem('user', response.data.data.name);
        return response.data.data;
    } catch (error: any) {
        return error.response?.data?.message
    }
};

export const updateUserProfile = async (formData:any) => {
    try {
        const customerId = localStorage.getItem('id');
        const response = await http.patch(`/customer/${customerId}`,formData);
        localStorage.setItem('city', response.data.data.address.city);
        localStorage.setItem('user', response.data.data.name);
        return response.status >= 200 && response.status <= 300 ? true : false;
    } catch (error: any) {
        return error.response?.data?.message
    }
};

export const getRestuarantById = async (id:string) => {
    try {
        const response = await http.get(`/menus/restaurant/all/${id}`);
        return response.data.data;
    } catch (error: any) {
        return error.response?.data?.message
    }
};

export const placeOrder = async (orderData: Object) => {
    try {
        const response = await http.post(`/order`,orderData);
        return response.data.data ? response.data.data : false;
    } catch (error: any) {
        return error.response?.data?.message
    }
};

export const getAllOrders = async () => {
    try {
        const response = await http.get(`/order`);
        return response.data.data;
    } catch (error: any) {
        return error.response?.data?.message
    }
};

export const updateOrder = async (itemId: string, item:Object) => {
    try {
        const response  = await http.patch(`/order/${itemId}`, item);
        return response.data.data;
    } catch (error: any) {
        return error.response?.data?.message
    }
};

export const handleImageSearch = async (formData: Object) => {
    try {
        const url = import.meta.env.VITE_BASE_URL;
        const token = localStorage.getItem('token');
        const response = await axios.post(`${url}menus/image/search`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                ...(token && { 'Authorization': `Bearer ${token}` })
            }});
        return response.data.data ?  response.data.data : false;
    } catch (error) {
        return false;
    }
};

export const cancelOrder = async (itemId: string) => {
    try {
        const response  = await http.patch(`/order/cancel/${itemId}`);
        return response.data.data;
    } catch (error: any) {
        return error.response?.data?.message
    }
};

export const rateRestuarant = async (rating: Object) => {
    try {
        const response  = await http.post(`/misc/rating`, rating);
        return response.data.data;
    } catch (error: any) {
        console.error(error.response?.data?.message);
        return false;
    }
};

export const restaurantRating = async (restaurantId: string) => {
    try {
        const response  = await http.get(`/misc/rating/restaurants/${restaurantId}`);
        return response.data.data;
    } catch (error: any) {
        console.error(error.response?.data?.message);
        return false;
    }
};

export const customerRating = async (customerId:string, restaurantId: string) => {
    try {
        const response  = await http.get(`/misc/rating/user/restaurants?restaurantId=${restaurantId}&userId=${customerId}`);
        return response.data.data;
    } catch (error: any) {
        console.error(error.response?.data?.message);
        return false;
    }
};

export const editCustomerRating = async (reviewId: string, customerRating: object) => {
    try {
        const response  = await http.patch(`/misc/rating/${reviewId}`, customerRating );
        return response.data.data;
    } catch (error: any) {
        console.error(error.response?.data?.message);
        return false;
    }
};