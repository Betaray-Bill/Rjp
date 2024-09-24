import {useSelector} from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'

export default function PrivateRoute() {
    console.log("Hii")
    // const {user} = useSelector((state)=> state.auth)
    const user = localStorage.getItem('user')
    console.log("User " + user)
  return user ? <Outlet/> : <Navigate to='/login'/>
}