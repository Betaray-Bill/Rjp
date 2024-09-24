import React, { useEffect, useState } from 'react'
import { useLoginMutation } from '../app/services/auth';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials } from '../features/authSlice';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';


function Login() {
    const [login, {isLoading, isSuccess}] = useLoginMutation()
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const {user} = useSelector((state)=> state.auth)
    
    const [formData, setFormData] = useState({
      email:'',
      password:''
    })
  
    const loginHandler = async(event) => {  
      event.preventDefault();
      console.log(formData)
      if(formData.email === '' || formData.password === ''){
        alert('Please enter all fields')
        return;
      }

      try {
          const data = await login(formData).unwrap();
          dispatch(setCredentials(data));
          console.log(user)
          if (user) {
            navigate('/home');
          }
      } catch (error) {
          console.log(error);
      }
    }
  

  return (
    <div>
        Login
        <Box
          component="form"
          sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
          noValidate
          onSubmit={loginHandler}
          autoComplete="off"
        >
          {/* <form onSubmit={loginHandler}> */}
          <TextField id="email" label="Email" name="email" onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})}  variant="outlined" />
          <TextField
            id="password"
            label="Password"
            type="password"
            variant="outlined"
            name="password" onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})} 
          />
          <Button variant="contained" type="submit" disabled={isLoading}>
            {isLoading? 'Loading...':'Submit'}
          </Button>
          {/* <button type="submit" disabled={isLoading}>
            {isLoading? 'Loading...':'Submit'}
          </button> */}
          {/* </form> */}
        </Box>        
        {/* <form onSubmit={loginHandler}>
          <input type="email" name="email" onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})} />
          <input type="password" name="password" onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})} />
          <button type="submit">Submit</button>
        </form> */}

        {
            user ? JSON.stringify(user) :"No data"
        }
    </div>  
  )
}

export default Login
