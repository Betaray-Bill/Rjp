import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials } from '../features/authSlice';
// import Box from '@mui/material/Box';
// import TextField from '@mui/material/TextField';
// import { Button } from '@mui/material';
import { useMutation } from 'react-query';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import LoginHero from '../assets/LoginHero.png';
import logo from '../assets/logo.png';
import api from '@/utils/api';



function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const {user} = useSelector((state)=> state.auth)
    // console.log(user.email)
    const [formData, setFormData] = useState({
      email:'',
      password:''
    })

    // LOGIN QUERY
    const loginMutation = useMutation((data) => {
        return api.post('/trainer/login', data)
      },
      {
        onSuccess: (data) => {
          console.log("login DOnes")
          dispatch(setCredentials(data.data.trainer[0]));
          localStorage.setItem('jwt', data.data.token);

          console.log(data)
          navigate('/home/dashboard'); 
          window.location.reload() 
         
        },
        onSettled: () => {
          console.log("Settled")
          if (data) {
            // navigate('/home/dashboard');  
          }
        },
        onError: (error) => {
          console.log(error);
        }
      }
    )
  
    const loginHandler = async(event) => {  
      event.preventDefault();
      console.log(formData)
      if(formData.email === '' || formData.password === ''){
        alert('Please enter all fields')
        return;
      }

      try {
          loginMutation.mutate(formData)
      } catch (error) {
          console.log(error);
      }
    }
  

  return (
    <div className='wrapper'>
      <div className="flex h-screen bg-gray-100">
        <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div className="mb-8">
              <img className="h-12 w-auto" src={logo} alt="Workflow" />
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
            </div>
            <Card className="mb-0 rounded-3xl p-2 ">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-center">Trainers Login</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={loginHandler} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" label="Email" type="email" required className="w-full" name="email" onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})}/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password"
                      label="Password"
                      type="password" 
                      className='w-full'
                      name="password" onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})} 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="remember" className="text-xs"/>
                      <Label htmlFor="remember" className="text-xs">Keep me signed in</Label>
                    </div>
                    <a href="#" className="text-xs text-blue-600 hover:underline">
                      {/* Forgot password? */}
                    </a>
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700">
                    Sign In
                  </Button>
                </form>
              </CardContent>
            </Card>
            <div className="mt-4 text-center">
              {/* <a href="#" className="text-sm text-gray-600 hover:underline">
                Trouble signing in?
              </a> */}
            </div>
          </div>
        </div>
        <div className="hidden lg:block relative w-0 flex-1">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src={LoginHero}
            alt="Abstract geometric pattern"
          />
        </div>
      </div>

    </div>  
  )
}

export default Login
