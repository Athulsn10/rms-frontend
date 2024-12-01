import { http } from '../../../../services/http';

export const getUserDetail = async () => {
    const customerId = '67419746abdc9151c633bf46'
    try {
        const response = await http.get(`/customer/${customerId}`);
        localStorage.setItem('user', response.data.data.name);
        return response.data.data;
    } catch (error: any) {
        return error.response?.data?.message
    }
}

export const updateUserProfile = async (formData:any) => {
    const customerId = '67419746abdc9151c633bf46'
    const headers = {
        'Content-Type': 'application/json',
    };
    try {
        const response = await http.patch(`/customer/${customerId}`,formData, {headers});
        return response.data.data.acknowledged;
    } catch (error: any) {
        return error.response?.data?.message
    }
}