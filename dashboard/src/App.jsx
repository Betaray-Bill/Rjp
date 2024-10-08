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
import AddTrainer from './Pages/AddTrainer.jsx'


function App() {
  const [count, setCount] = useState(0)
  const {currentUser} = useSelector(state => state.auth)

  return (
    <Fragment>
      <Routes>
        <Route path='/login' element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path='/' index element={<Home />} />
          <Route path='/home' element={<Home />}>
            <Route path='profile' element={<Profile />} />
            {
              currentUser && ((currentUser.employee.role[0].name === "ADMIN" || currentUser.employee.role[0].name === "MANGER") &&
              <Route path='add' element={<AddEntity />} />)
            }
            {
              currentUser && ((currentUser.employee.role[0].name === "ADMIN" || currentUser.employee.role[0].name === "MANGER" || currentUser.employee.role[0].name === "KeyAccounts") &&
              <Route path='search' element={<Search />} />)
            }
            {
              currentUser && ((currentUser.employee.role[0].name === "ADMIN" || currentUser.employee.role[0].name === "MANGER" || currentUser.employee.role[0].name === "Trainer Sourcer") &&
              <Route path='trainer' element={<AddTrainer />}>
                {/* <Route path='trainer/:id' element={<TrainerDetails />} /> */}
              </Route>
            )
              
            }
          </Route>
          
          <Route path="*" element={
            <div>Page not found <Link to="/home">Home</Link></div>
          }></Route>

        </Route>


      </Routes>
    </Fragment>
  )
}

export default App
