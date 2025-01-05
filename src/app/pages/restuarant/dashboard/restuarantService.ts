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
        const response = await http.get(`/menus`);
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
        return response.status >= 200 && response.status <= 300 ? response.data.data.ingredients : false;
    } catch (error: any) {
        return error.response?.data?.message
    }
};