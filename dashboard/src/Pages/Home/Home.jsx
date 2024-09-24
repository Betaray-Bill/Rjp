import React from 'react'
import { useSelector } from 'react-redux'

function Home() {
    const {currentUser} = useSelector(state => state.auth)

  return (
    <div>
      Home

      {
        currentUser && (
          <div>
            Welcome, {currentUser.employee.name}!
          </div>
        )
      }
    </div>
  )
}

export default Home
