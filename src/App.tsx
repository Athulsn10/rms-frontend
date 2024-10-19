import './App.css'
import Login from './Auth/Login';
import Home from './Components/home';
import { Route, Routes } from 'react-router-dom';

const App =()=> {

  return (
    <>
      <Routes>
      <Route path='/' element={<Login/>}/>
      <Route path='/Home' element={<Home/>}/>
     </Routes>
    </>
  )
}

export default App
