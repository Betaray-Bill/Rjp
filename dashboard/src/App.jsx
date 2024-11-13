import { Fragment, useState } from 'react'
import './App.css'
import { Link, Navigate, Route, Routes } from 'react-router-dom'
import Login from './Pages/Login/Login'
import Home from './Pages/Home/Home'
import ProtectedRoute from './utils/ProtectedRoutes.jsx'
import Profile from './Pages/Profile/Profile.jsx'
// import AddEntity from './Pages/AddEntity/AddEntity.jsx'
import Search from './Pages/Search/Search.jsx'
import { useSelector } from 'react-redux'
import {userAccess}  from './utils/CheckUserAccess.js'
import {RolesEnum} from './utils/constants.js'
import Employee from './Pages/Employees/Employee.jsx'
import AddCompany from './Layout/Company/AddCompany'
import Trainer from './Pages/Trainer/Trainer'
import GetTrainer from './Layout/Trainer/GetTrainer'
import ViewTrainer from './Layout/Trainer/ViewTrainer'
import AddTrainer from './Layout/Trainer/AddTrainer'
import GetAllEmployee from './Layout/Employees/GetAllEmployee'
import AddEmployee from './Layout/Employees/AddEmployee'
import ViewEmployee from './Layout/Employees/ViewEmployee'
import ViewNewResume from './Layout/Trainer/ViewTrainer/ViewNewResume'
import ViewResumeDetails from './Layout/Trainer/ViewTrainer/ViewResumeDetails'
import Company from './Pages/Company/Company'
import Project from './Pages/Project/Project'
import AddProject from './Layout/Project/AddProject'
import ViewProjects from './Layout/Project/ViewProjects'
import ProjectSearchTrainer from './Layout/Project/Components/ProjectSearchTrainer'
import ViewSingleProject from './Layout/Project/SingleProject/ViewSingleProject'
import Resume from './Layout/Resume/Resume'


function App() {
  const [count, setCount] = useState(0)
  const {currentUser} = useSelector(state => state.auth)

  return (
    <div className=''>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/' index element={<Navigate to="/home" replace />}></Route>

        <Route element={<ProtectedRoute />}>
          <Route path='/' index element={<Home />} />
          <Route path='/home' element={<Home />}>
            {
              userAccess([RolesEnum.ADMIN, RolesEnum.KEY_ACCOUNT], currentUser?.employee.role) && 
              <Route path='search' element={<Search />} />
            }
            {
               userAccess([RolesEnum.ADMIN, RolesEnum.KEY_ACCOUNT], currentUser?.employee.role) &&
              <Route path='employee' element={<Employee />}>
                <Route path='' index element={<GetAllEmployee />} />
                <Route path='add' element={<AddEmployee />} />
                <Route path='view/:id' element={<ViewEmployee />} />
                <Route path='*' element={<Navigate to="/home" replace />} />
              </Route>
            }
            {
              userAccess([RolesEnum.ADMIN, RolesEnum.TRAINER_SOURCER], currentUser?.employee.role) &&
              (
                <Route path='trainer' element={<Trainer />}>
                  <Route path='add' element={<AddTrainer />} />
                  <Route path='' index element={<GetTrainer />} />
                  {/* <Route path='edit/:id' element={<AddTrainer />} /> */}
                  <Route path='resume/:id' element={<Resume />} />
                  <Route path='view/:id' element={<ViewTrainer />}>
                    <Route path='add' element={<ViewNewResume />} />
                    {/* <Route path='resume' element={<ViewResumeDetails />} /> */}
                    {/* <Route path='add' element={<ViewNewResume />} /> */}

                  </Route>
                  <Route path='*' element={<Navigate to="/home" replace />} />
                </Route>
              )
            }

            {
              userAccess([RolesEnum.ADMIN, RolesEnum.KEY_ACCOUNT], currentUser?.employee.role) &&
               <Route path='company' element={<Company />}>
                {/* add-company */}
                <Route path='add-company' element={<AddCompany />} />
               </Route>
            }


            {
              userAccess([RolesEnum.ADMIN, RolesEnum.KEY_ACCOUNT], currentUser?.employee.role) &&
               <Route path='projects' element={<Project />}>
                {/* add-company */}
                <Route path=''  index element={<ViewProjects />} />
                <Route path='create' element={<AddProject />} />
                <Route path='view/:projectId' element={<ViewSingleProject />} />
               </Route>
            }
            <Route path='profile' element={<Profile />} />
          </Route>
        </Route>
          
          <Route path="*" element={
            <div>Page not found <Link to="/home">Home</Link></div>
          }></Route>

        {/* </Route> */}


      </Routes>
    </div>
  )
}

export default App
