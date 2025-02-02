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
        return response.data.data.acknowledged;
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