import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Login from './Pages/Login'
import ProtectedRoute from './utils/ProtectedRoutes.jsx'
import Home from './Pages/Home'


function App() {

  return (
    <>

      <header>
        <h2>RJP </h2>
      </header> 

      {/* Routing */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute/> }>
          <Route path="/" element={<Home />}/>
          <Route path="/home" element={<Home />}/>
        </Route>
      </Routes>

    </>
  )
}

export default App
