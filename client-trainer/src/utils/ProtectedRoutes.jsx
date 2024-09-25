import {useSelector} from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'

export default function PrivateRoute() {
    const {user} = useSelector(state => state.auth)
    // let user = null
  return user ? <Outlet/> : <Navigate to='/login'/>
}