import './App.css'
import Login from './Components/Login';
import { Route, Routes } from 'react-router-dom';

const App =()=> {

  return (
    <>
      <Routes>
      <Route path='/login' element={<Login/>}/>
     </Routes>
    </>
  )
}

export default App
