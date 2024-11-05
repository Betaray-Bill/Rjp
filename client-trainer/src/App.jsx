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
import ResumeDownload from './Layout/Resume/ResumeDownload'
import ResumeExtractor from './Pages/ResumeExtractor'
import AzureBlobUploader from './Pages/AzureBlobUploader'


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
        <Route path='/home/resume' index element={<Navigate to="/home/resume/main" replace />}></Route>
        {/* <Route path="/resume" element={<ResumeExtractor />} /> */}
        {/* <Route path="/fileupload" element={<AzureBlobUploader />} /> */}

        {/* Protected Routes */}
        <Route element={<ProtectedRoute/> }>
          <Route path='/home' element={<Home />}>
            <Route path='dashboard' index element={<Dashboard /> }/>
            <Route path="resume" element={<Resume />}>
              <Route path='new' element={<ResumeNew />} />
              <Route path='download/preview/:resumeName' element={<ResumeDownload />} />   {/* Preview Resume Routes */}
              {/* Main Resume and Copies URL */}
              <Route path='copy/:id' element={<ResumeForm/>} />
              <Route path='main' element={<ResumeForm/>} />
            </Route>
            <Route path="account" element={<Account />}/>
          </Route>
        </Route>
      </Routes>

    </div>
  )
}

export default App
