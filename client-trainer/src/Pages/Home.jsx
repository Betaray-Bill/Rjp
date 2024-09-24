import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useLogoutQuery } from '../app/services/auth';
import { useSelector } from 'react-redux';


function Home() {
  const userData = localStorage.getItem('user')
  const [users, setUser] = useState([])
  const navigate = useNavigate()
  const {user} = useSelector((state)=> state.auth)

  console.log(user)
  useEffect(() => {
    if(users !== null || users !== undefined) {

      setUser(JSON.parse(userData))
      console.log(JSON.parse(userData))
    }
  }, [userData])


  // Sign out
  // const {logout} = useLogoutQuery()
  const signOut = async() => {
    // localStorage.removeItem('user')
    setUser(null)
    // logout()

    navigate("/login")
  }


  return (
    <div>
      <h2 onClick={signOut}>Sign Out</h2>
      Home
      {
        users &&
        <div>
          {/* <h1>Welcome, {user}</h1> */}
          {/* <p>Email: {user?.token}</p> */}
          token :
          {
            // JSON.stringify(userData)
            users.token
          }
          trainer :
          {
            users?.trainer?.map((e) => {
              <p>{e}</p>
            })
          }
        </div>
      }
    </div>
  )
}

export default Home
