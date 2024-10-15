import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import Login from './Pages/Login'
import ProtectedRoute from './utils/ProtectedRoutes.jsx'
import Home from './Pages/Home'
import Account from './Pages/Account.jsx'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { logout } from './features/authSlice.js'
import Dashboard from './Pages/Dashboard.jsx'
import Resume from './Pages/Resume.jsx'
import ResumeForm from './Layout/Resume/ResumeForm'
import ResumeNew from './Layout/Resume/ResumeNew'


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
    <div className='m-0 p-0 overflow-hidden'>
     
      {/* Routing */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path='/' index element={<Navigate to="/home/dashboard" replace />}></Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute/> }>
          <Route path='/home' element={<Home />}>
            <Route path='dashboard' index element={<Dashboard /> }/>
            <Route path="resume" element={<Resume />}>
              <Route path='new' element={<ResumeNew />} />
              <Route path='copy/:id' element={<ResumeForm/>} />
            </Route>
            <Route path="account" element={<Account />}/>
          </Route>
        </Route>
      </Routes>

    </div>
  )
}

export default App
