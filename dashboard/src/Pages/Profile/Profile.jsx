import React from 'react'
import { useSelector } from 'react-redux';

function Profile() {
    const {currentUser} = useSelector(state => state.auth)
    console.log(currentUser)
  return (
    <div >
      <h1 >Profile</h1>
      <div>
        <p><strong>Name:</strong> {currentUser.employee.name}</p>
        <p><strong>Email:</strong> {currentUser.employee.email}</p>
        {/* <p><strong>Role:</strong> {currentUser.employee.role.name}</p> */}
        <p><strong>Created At:</strong> {new Date(currentUser.employee.createdAt).toLocaleString()}</p>
        <p><strong>Updated At:</strong> {new Date(currentUser.employee.updatedAt).toLocaleString()}</p>
        <div>
          <strong>Roles:</strong>
          <ul>
            {currentUser.employee.role.map((auth, index) => (
              <li key={index}>{auth.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Profile
