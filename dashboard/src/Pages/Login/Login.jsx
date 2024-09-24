import { Box, Button, Container, TextField } from '@mui/material'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { signInStart, signInSuccess } from '../../features/authSlice'
import { useLoginMutation } from '../../app/services/authService'

function Login() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {currentUser } = useSelector(state => state.auth)
    const [login, {error, isSuccess}] = useLoginMutation()

    const [formData, setFormData] = useState({
        email:'',
        password:''
      })
    
    
    const loginHandler = async(event) => {  
        event.preventDefault();
        console.log(formData)
        dispatch(signInStart())
        if(formData.email === '' || formData.password === ''){
          alert('Please enter all fields')
          return;
        }

        // Fetch Data by RTK Query
        // const res = await login(formData).unwrap()
        // console.log(res)
        // console.log(isSuccess)

        const response = await fetch("http://localhost:5000/api/employee/login",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        const data = await response.json()
        console.log(data)
            dispatch(signInSuccess(data))

        // Dispatch it to the Redux
        // dispatch(signInSuccess(res))
        console.log(currentUser)
        if(currentUser){
            navigate('/home')
        }
    }

    console.log(currentUser)

  return (
    <div>
    <Container>
        <h3>Login</h3>
      <Box
          component="form"
          sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
          noValidate
          onSubmit={loginHandler}
          autoComplete="off"
        >
          <TextField id="email" label="Email" name="email" onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})}  variant="outlined" />
          <TextField
            id="password"
            label="Password"
            type="password"
            variant="outlined"
            name="password" onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})} 
          />
          <Button variant="contained" type="submit" >
            Login
          </Button>
        </Box> 
    </Container>
    {
        error && <div>Error</div>  // Display error message if any
    }
    </div>
  )
}

export default Login
