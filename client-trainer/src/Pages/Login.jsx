import React, { useState } from 'react'
import { useLoginMutation } from '../app/services/auth';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signInFailure, signInStart, signInSuccess } from '../features/authSlice.js';

function Login() {
    const [login, {data, isSuccess}] = useLoginMutation()
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const {currentUser} = useSelector(state => state.auth)
    
    const [formData, setFormData] = useState({
      email:'',
      password:''
    })
  
    // axios.defaults.withCredentials = true;
    const loginHandler = async(event) => {
      event.preventDefault();
      console.log(formData)
      if(formData.email === '' || formData.password === ''){
        alert('Please enter all fields')
        return;
      }
    //   const userData = await login(formData)
    //     .unwrap()
    //     .then((payload) => {
    //         console.log('fulfilled', payload.trainer[0])

    //     })
    //     .catch((error) => console.error('rejected', error));

    //   console.log(data.trainer)
    // console.log(isSuccess)
    //   if(isSuccess){
    //     navigate('/home', { replace: true });
    //     dispatch(signInSuccess(userData.trainer[0]));
    //   }else{
    //     // setFormData({
    //     //     email:'',
    //     //     password:''
    //     // })
    //   }

    try {
        dispatch(signInStart());
        const res = await fetch('http://localhost:5000/api/trainer/login', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        const data = await res.json();
        console.log(data)
        // console.log(data !== null || data.trainer == [] || data === undefined)
        if (data === null || data.trainer == [] || data === undefined) {
            dispatch(signInFailure(data));
            return;
        }
        console.log(data)
        dispatch(signInSuccess(data));
        navigate('/home');
        console.log(currentUser)
    } catch (error) {
        dispatch(signInFailure(error));
    }
    }

  return (
    <div>
        Login
        <form onSubmit={loginHandler}>
          <input type="email" name="email" onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})} />
          <input type="password" name="password" onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})} />
          <button type="submit">Submit</button>
        </form>

        {
            currentUser && JSON.stringify(currentUser)
        }
    </div>  
  )
}

export default Login
