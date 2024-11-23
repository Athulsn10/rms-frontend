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
      navigate('/');
    } catch (error) {
      console.error('Error logging in', error);
    }
};

export const handleRegister = async (formData:any, navigate: (path: string) => void) => {
    const headers = {
        'Content-Type': 'application/json',
      };
  
      try {
        const response = await http.post('/customer',formData,{ headers });
  
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', response.data.data.name);
        navigate('/');
      } catch (error) {
        console.error('Error logging in', error);
      }
}