import {useSelector} from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'

export default function PrivateRoute() {
    console.log("Hii")
    const {currentUser} = useSelector(state => state.auth)
    console.log("User " + currentUser)
  return currentUser ? <Outlet/> : <Navigate to='/login'/>
}