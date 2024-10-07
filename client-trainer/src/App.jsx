import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Link, Route, Routes, useNavigate } from 'react-router-dom'
import Login from './Pages/Login'
import ProtectedRoute from './utils/ProtectedRoutes.jsx'
import Home from './Pages/Home'
import Account from './Pages/Account.jsx'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { logout } from './features/authSlice.js'
import Dashboard from './Pages/dashboard.jsx'


function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  
  axios.defaults.withCredentials = true;
  const signOut = async() => {
    await axios.get('http://localhost:5000/api/trainer/signout')
    dispatch(logout())
    navigate("/login")
  }
  

  return (
    <div className='wrapper'>
     
      {/* Routing */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute/> }>
          <Route path='/home' element={<Home />}>
          <Route path='dashboard' element={<Dashboard /> }/>
            <Route path="account" element={<Account />}/>
          </Route>
        </Route>
      </Routes>

    </div>
  )
}

export default App
