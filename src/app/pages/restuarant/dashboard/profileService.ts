import { http } from '../../../../services/http';

const customerId = localStorage.getItem('id');
export const getUserDetail = async () => {
    try {
        const response = await http.get(`/restaurant/${customerId}`);
        localStorage.setItem('user', response.data.data.name);
        return response.data.data;
    } catch (error: any) {
        return error.response?.data?.message
    }
}

export const updateUserProfile = async (formData:any) => {
    try {
        const response = await http.patch(`/restaurant/${customerId}`,formData);
        return response.data.data.acknowledged;
    } catch (error: any) {
        return error.response?.data?.message
    }
}