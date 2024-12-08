import './index.css'
import React from 'react'
import App from './App.tsx'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './app/context/provider'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
     <AppProvider> 
      <App />
    </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
)
