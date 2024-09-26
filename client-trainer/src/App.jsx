import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Login from './Pages/Login'
import ProtectedRoute from './utils/ProtectedRoutes.jsx'
import Home from './Pages/Home'
import Account from './Pages/Account.jsx'


function App() {

  return (
    <div className='wrapper'>
      {/* Routing */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute/> }>
          <Route path='/' index element={<Home />} />
          <Route path='/home' element={<Home />}>
            <Route path="account" element={<Account />}/>
          </Route>
        </Route>
      </Routes>

    </div>
  )
}

export default App
