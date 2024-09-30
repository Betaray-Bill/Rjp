import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials } from '../features/authSlice';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { useMutation } from 'react-query';
import axios from 'axios';




function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const {user} = useSelector((state)=> state.auth)
    // console.log(user.email)
    const [formData, setFormData] = useState({
      email:'',
      password:''
    })

    const loginMutation = useMutation((data) => {
      return axios.post('http://localhost:5000/api/trainer/login', data)
    })
  
    const loginHandler = async(event) => {  
      event.preventDefault();
      console.log(formData)
      if(formData.email === '' || formData.password === ''){
        alert('Please enter all fields')
        return;
      }

      try {
          // loginMutation.mutate(formData, {
          //   onSuccess: (data) => {
          //     console.log("login doen")
          //     dispatch(setCredentials(data.data));
          //     console.log(data)
          //     if (data) {
          //       navigate('/home');
          //     }
          //   },
          //   onSettled: () => {
          //     console.log("Settled")
          //   },
          //   onError: (error) => {
          //     console.log(error);
          //   }
          // })
          const res =await axios.post('http://localhost:5000/api/trainer/login', formData)
            const data = await res.data;
            console.log(data)
            dispatch(setCredentials(data.trainer[0]))
            console.log(user)
            navigate('/home');
  
      } catch (error) {
          console.log(error);
      }
    }
  

  return (
    <div className='wrapper'>
        {/* Login */}
        <header>
          <h2>RJP Trainer</h2>
        </header>
        {/* <hr />
        <hr /> */}
        <h4>Login Page</h4>
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
          <Button variant="contained" type="submit">
            {/* {isLoading? 'Loading...':'Submit'} */}
            Submit
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
