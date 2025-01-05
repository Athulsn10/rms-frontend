import { http } from '../../../services/http';



export const getRestuarentsByCity = async (city: string) => {
    try {
        const response = await http.get(`/restaurant/search/${city}`);
        localStorage.setItem('user', response.data.data.name);
        return response.status >= 200 && response.status <= 300 ? response.data.data : false;
    } catch (error: any) {
        return error.response?.data?.message
    }
}

export const getRestuarents = async () => {
    try {
        const response = await http.get(`/restaurant`);
        return response.status >= 200 && response.status <= 300 ? response.data.data : false;
    } catch (error: any) {
        return error.response?.data?.message
    }
}