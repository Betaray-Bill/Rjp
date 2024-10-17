import { Fragment, useState } from 'react'
import './App.css'
import { Link, Route, Routes } from 'react-router-dom'
import Login from './Pages/Login/Login'
import Home from './Pages/Home/Home'
import ProtectedRoute from './utils/ProtectedRoutes.jsx'
import Profile from './Pages/Profile/Profile.jsx'
import AddEntity from './Pages/AddEntity/AddEntity.jsx'
import Search from './Pages/Search/Search.jsx'
import { useSelector } from 'react-redux'
import AddTrainer from './Pages/AddEntity/AddTrainer'
import { userAccess } from './utils/CheckUserAccess'
import RolesEnum from './utils/constants'


function App() {
  const [count, setCount] = useState(0)
  const {currentUser} = useSelector(state => state.auth)

  return (
    <Fragment>
      <Routes>
        <Route path='/login' element={<Login />} />
        {/* <Route path='/' index element={<Navigate to="/home/dashboard" replace />}></Route> */}

        <Route element={<ProtectedRoute />}>
          {/* <Route path='/' index element={<Home />}> */}
          <Route path='/home' element={<Home />}>
            {
              userAccess([RolesEnum.ADMIN, RolesEnum.MANAGER, RolesEnum.KEY_ACCOUNT], currentUser.employee.role) && 
              <Route path='search' element={<Search />} />
            }
            {
               userAccess([RolesEnum.ADMIN], currentUser.employee.role) &&
              <Route path='add' element={<AddEntity />} />
            }
            {
              userAccess([RolesEnum.ADMIN, RolesEnum.TRAINER_SOURCER, RolesEnum.MANAGER], currentUser.employee.role) &&
               <Route path='trainer' element={<AddTrainer />} />
            }
    
            <Route path='profile' element={<Profile />} />
          </Route>
        </Route>
          
          <Route path="*" element={
            <div>Page not found <Link to="/home">Home</Link></div>
          }></Route>

        {/* </Route> */}


      </Routes>
    </Fragment>
  )
}

export default App
