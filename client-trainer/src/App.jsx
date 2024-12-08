import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Link, Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom'
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
import SingleProject from './Layout/Home/Deals/Project/SingleProject'
import TrainingDomains from './Pages/TrainingDomains'
import ResumeDisplay from './Layout/Resume/ResumeDisplay'


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
        <Route path='/home' index element={<Navigate to="/home/dashboard" replace />}></Route>

        <Route path='/home/resume' index element={<Navigate to="/home/resume/:id" replace />}></Route>
     
        {/* Protected Routes */}
        <Route element={<ProtectedRoute/> }>
          <Route path='/home' element={<Home />}>
            <Route path='dashboard' index element={<Dashboard /> }/>
            <Route path='domain' index element={<TrainingDomains /> }/>

            {/* Resume */}
            {/* <Route path="resume" element={<Resume />}>
              <Route path='new' element={<ResumeNew />} />
              <Route path='download/preview/:id' element={<ResumeDownload />} />   
    */}
              {/* <Route path=':id' index element={<ResumeForm/>} /> */}
              {/* <Route path='main' element={<ResumeForm/>} /> */}
            {/* </Route> */}
            <Route path="resume" element={<Resume />}>
              <Route path='new' element={<ResumeForm />} />  {/*New Main Resume*/}
              <Route path='copy' element={<ResumeForm />} />  {/*New Copy Resume*/}
              <Route path=':id' index element={<ResumeDisplay  />} /> {/*Display Resume*/}
              <Route path='download/preview/:id' element={<ResumeDownload />} />   
            </Route>

            {/* Account */}
            <Route path="account" element={<Account />}/>

            <Route path='project/:projectId' element={<SingleProject /> }></Route>
          </Route>

        </Route>
      </Routes>

    </div>
  )
}

export default App
