import axios from 'axios';
import { http } from '../../../../services/http';

export const getUserDetail = async () => {
    try {
        const restuarantId = localStorage.getItem('id');
        const response = await http.get(`/restaurant/${restuarantId}`);
        localStorage.setItem('user', response.data.data.name);
        return response.data.data;
    } catch (error: any) {
        return error.response?.data?.message
    }
};

export const updateUserProfile = async (formData: any) => {
    try {
        const restuarantId = localStorage.getItem('id');
        const response = await http.patch(`/restaurant/${restuarantId}`, formData);
        return response.data.data.acknowledged;
    } catch (error: any) {
        return error.response?.data?.message
    }
};

export const createMenu = async (formData: any) => {
    try {
        const url = import.meta.env.VITE_BASE_URL;
        const token = localStorage.getItem('token');
        const response:any = await axios.post(`${url}menus`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                ...(token && { 'Authorization': `Bearer ${token}` })
            },
        });
        return response.status >= 200 && response.status <= 300 ? true : false;
    } catch (error: any) {
        return error.response?.data?.message
    }
};

export const editMenu = async (id: string, formData: any) => {
    try {
        const url = import.meta.env.VITE_BASE_URL;
        const token = localStorage.getItem('token');
        const response:any = await axios.patch(`${url}menus/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                ...(token && { 'Authorization': `Bearer ${token}` })
            },
        });
        return response.status >= 200 && response.status <= 300 ? true : false;
    } catch (error: any) {
        return error.response?.data?.message
    }
};

export const getMenus = async () => {
    try {
        const response = await http.get(`/menus/restaurant/all`);
        return response.data.data;
    } catch (error: any) {
        return error.response?.data?.message
    }
};

export const deleteMenu = async (itemId: String) => {
    try {
        const response = await http.delete(`/menus/${itemId}`);
        console.log('response:',response)
        return response.status >= 200 && response.status <= 300 ? true : false;
    } catch (error: any) {
        return error.response?.data?.message
    }
};

export const imageUpload = async (file: any) => {
    try {
        const url = import.meta.env.VITE_BASE_URL;
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('image', file);
        const response:any = await axios.post(`${url}menus/get-ingredients`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                ...(token && { 'Authorization': `Bearer ${token}` })
            },
        });
        return response.status >= 200 && response.status <= 300 ? response.data.data : false;
    } catch (error: any) {
        return error.response?.data?.message
    }
};

export const getAllOrders = async () => {
    try {
        const restuarantId = localStorage.getItem('id')
        const response = await http.get(`/order/restaurant/${restuarantId}`);
        return response.data.data;
    } catch (error: any) {
        return error.response?.data?.message
    }
};

export const updateOrder = async (orderId: string, order: object) => {
    try {
        const response = await http.patch(`/order/status/${orderId}`, order);
        return response.data.data;
    } catch (error: any) {
        return error.response?.data?.message
    }
};

export const orderPaymentStatus = async (orderId: string, order: object) => {
    try {
        const response = await http.patch(`/order/payment/${orderId}`, order);
        return response.data.data;
    } catch (error: any) {
        return error.response?.data?.message
    }
};

export const handleFetchBillPath = async (orderId:string) => {
    try {
        const response = await http.get(`/order/bill/${orderId}`);
        return response.data.data ? response.data.data : false;
    } catch (error: any) {
        return error.response?.data?.message;
    }
};

export const handleBillPdfDownload = async (path:string) => {
    try {
        const response = await http.get(`/files/orders/bill/${path}`, { responseType: 'blob'});
        console.log('response.data:',response.data)
        return response.data ? response.data : false;
    } catch (error: any) {
        return error.response?.data?.message;
    }
};