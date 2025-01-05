import React, { useEffect, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { useNavigate } from 'react-router-dom'
// import { setCredentials } from '../../features/authSlice'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// import { setCredentials } from '../features/authSlice';
// import Box from '@mui/material/Box';
// import TextField from '@mui/material/TextField';
// import { Button } from '@mui/material';
import { useMutation } from 'react-query';
// import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import LoginHero from '../../assets/LoginHero.png';
import logo from '../../assets/logo.png';
import { setCredentials } from '@/features/authSlice';

function Login() {

    const dispatch = useDispatch()
    const {currentUser} = useSelector(state => state.auth)
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email:"",
        password:""
    })

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name] : e.target.value})
    }

    const token = localStorage.getItem('empToken'); // Get the token from localStorage (or any storage)

    axios.defaults.withCredentials = true;
    const loginHandler = async(e) => {
        e.preventDefault()
        try {
            const res = await axios.post('http://bas.rjpinfotek.com:5000/api/employee/login', formData)  

            const data = await res.data;
            console.log(data)
            dispatch(setCredentials(data))
            localStorage.setItem('empToken', data.token);
            console.log(currentUser)
            window.location.reload()
            navigate('/home');
        } catch (error) {
            alert("Unable to Login")
            console.log(error)
        }
    }

    useEffect(()=>{
        if(currentUser){
            navigate('/home')  // Redirect to home page when user is authenticated. If not authenticated, it will remain on login page.  // If you want to redirect to another page, replace "/home" with the desired path.  // Note: You need to have access to the navigate hook in your component to use it.  // You can install it by running "npm install react-router-dom" in your project directory.  // Also, you need to have the necessary backend setup to handle the login request.  // In the backend, you should have a route that looks something like this:  // app.post('/api/employee/login', async (req, res) => {  //     const { email, password } = req.body;  //     const user = await User.findOne({ email });  //     if (!user ||!(await user.comparePassword(password))) {  //         return res.status(401).json
        }
        console.log(currentUser)
    }, [])


    // console.log(currentUser)

  return (
    <div className='wrapper'>
        <div className="flex h-screen bg-gray-100">
            <div className="flex-1 w-[50vw] flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                <div className="mb-8">
                    <img className="h-12 w-auto" src={logo} alt="Workflow" />
                    <h2 className="mt-6 text-xl text-center font-extrabold text-gray-900">Sign in to your account</h2>
                </div>
                <Card className="mb-0 rounded-xl p-2 ">
                    <CardHeader>
                    <CardTitle className="text-2xl font-semibold text-center">Login</CardTitle>
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
                            Forgot password?
                        </a>
                        </div>
                        <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700">
                         Sign In
                        </Button>
                    </form>
                    </CardContent>
                </Card>
                <div className="mt-4 text-center w-[50vw] hidden">
                    <a href="#" className="text-sm text-gray-600 hover:underline">
                    Trouble signing in?
                    </a>
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
