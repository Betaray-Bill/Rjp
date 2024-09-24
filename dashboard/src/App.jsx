import { Fragment, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Login from './Pages/Login/Login'
import Home from './Pages/Home/Home'
import ProtectedRoute from './utils/ProtectedRoutes.jsx'


function App() {
  const [count, setCount] = useState(0)

  return (
    <Fragment>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path='/' exact element={<Home />} />
          <Route path='/home' element={<Home />} />
        </Route>


      </Routes>
    </Fragment>
  )
}

export default App
