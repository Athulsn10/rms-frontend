import axios from 'axios';
import { http } from '../../services/http';

export const handleLogIn = async (email: string, password: string,  navigate: (path: string) => void) => {

    const headers = {
      'Content-Type': 'application/json',
    };

    try {
      const response = await http.post(
        '/auth/login/',
        {
          email: email,
          password: password,
        },
        { headers }
      );
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', response.data.data.name);
      localStorage.setItem('email', response.data.data.email);
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('id', response.data.data.id);
      
      if (response.data.data.address) {
        localStorage.setItem('city', response.data.data.address.city);
      }

      if (response.data.data.gstin) {
        localStorage.setItem('restuarant', 'true');
        navigate('/dashboard');
      } else {
        navigate('/');
      }
      
      return null;
    } catch (error:any) {
      return error.response?.data?.message
    }
};

export const handleCustomerRegister = async (formData:any) => {
    const headers = {
        'Content-Type': 'application/json',
      };
  
      try {
        const response = await http.post(`/customer`,formData,{ headers });  
        return response.status >= 200 && response.status <= 300 ? {status: true} : {status: false};
      } catch (error:any) {
        return {status : false , message: error.response?.data?.message};
      }
};

export const handleRestuarantRegister = async (formData:any) => {
  try {
    const url = import.meta.env.VITE_BASE_URL;
    const token = localStorage.getItem('token');
    const response:any = await axios.post(`${url}restaurant`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            ...(token && { 'Authorization': `Bearer ${token}` })
        },
    });
    return response.status >= 200 && response.status <= 300 ? {status: true} : {status: false};
} catch (error: any) {
   return {status : false , message: error.response?.data?.message};
}
}