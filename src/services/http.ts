import axios from 'axios';

const url = import.meta.env.VITE_BASE_URL
console.log(url)
export const http = axios.create({baseURL:`${url}`, 
     headers: {
    'Content-Type': 'application/json',
  },})