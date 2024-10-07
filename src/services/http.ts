import axios from 'axios';

export const http = axios.create({baseURL:'{{url}}', 
     headers: {
    'Content-Type': 'application/json',
  },})