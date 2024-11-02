import './App.css'
import Authentication from './app/auth/authentication';
import Home from './app/home/home';
import { Route, Routes } from 'react-router-dom';

const App =()=> {

  return (
    <>
      <Routes>
      <Route path='/' element={<Authentication/>}/>
      <Route path='/Home' element={<Home/>}/>
     </Routes>
    </>
  )
}

export default App
