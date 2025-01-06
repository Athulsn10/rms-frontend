import { http } from '../../../services/http';
import axios from 'axios';


export const getRestuarentsByCity = async (city: string) => {
    try {
        const response = await http.get(`/restaurant/search/${city}`);
        return response.status >= 200 && response.status <= 300 ? response.data.data : false;
    } catch (error: any) {
        return error.response?.data?.message
    }
}

export const getRestuarents = async () => {
    try {
        const url = import.meta.env.VITE_BASE_URL;
        const response = await axios.get(`${url}restaurant`);
        return response.status >= 200 && response.status <= 300 ? response.data.data : false;
    } catch (error: any) {
        return error.response?.data?.message
    }
}