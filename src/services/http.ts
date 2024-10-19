import axios from 'axios';

export const http = axios.create({baseURL:'https://rms.sreekanth.tech', 
     headers: {
    'Content-Type': 'application/json',
  },})