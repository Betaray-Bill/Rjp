import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useLoginMutation } from './app/services/auth'
import { useDispatch, useSelector } from 'react-redux';
import { signInSuccess } from './features/authSlice'
import { Route, Routes } from 'react-router-dom'
import Login from './Pages/Login'
import ProtectedRoute from './utils/ProtectedRoutes.jsx'
import Home from './Pages/Home'


function App() {
  // const [login, {data, isSuccess}] = useLoginMutation()
  // const dispatch = useDispatch();
  
  // // const currentUser = useSelector(state => state.user?.currentUser || {}); 
  // const [formData, setFormData] = useState({
  //   email:'',
  //   password:''
  // })

  // // axios.defaults.withCredentials = true;
  // const loginHandler =async (event) => {
  //   event.preventDefault();
  //   console.log(formData)
  //   const userData = await login(formData).unwrap();

  //   console.log(userData.trainer[0])
  //   await dispatch(signInSuccess(userData.trainer[0]));
    
  //   // console.log(currentUser)

  // }

  return (
    <>

      <header>
        <img src={reactLogo} alt="React Logo" />
        <img src={viteLogo} alt="Vite Logo" />
      </header> 

      {/* Routing */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute/> }>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/home" element={<Home />}/>
        </Route>
      </Routes>

    </>
  )
}

export default App
