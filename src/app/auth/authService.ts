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
      console.log(response.data.data);
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

export const handleRegister = async (formData:any, registrationType:string) => {
    const headers = {
        'Content-Type': 'application/json',
      };
  
      try {
        const response = await http.post(`/${registrationType}`,formData,{ headers });  
        return response.status >= 200 && response.status <= 300 ? true : false;
      } catch (error:any) {
        console.error('Error logging in', error);
        return error.response?.data?.message
      }
}