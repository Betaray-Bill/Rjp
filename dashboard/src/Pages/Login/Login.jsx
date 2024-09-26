import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setCredentials } from '../../features/authSlice'
import axios from 'axios'

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

    axios.defaults.withCredentials = true;
    const submitHandler = async(e) => {
        e.preventDefault()
        try {
            const res = await axios.post('http://localhost:5000/api/employee/login', formData)  

            const data = await res.data;
            console.log(data)
            dispatch(setCredentials(data))
            console.log(currentUser)
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
    <div className="wrapper">
        <section>
            <h2>Login Page</h2>
            <form className="container" onSubmit={submitHandler}>
                    <div className="input-floating-label">
                         <label><ion-icon name="mail-outline"></ion-icon> <span>Email</span></label>
                        <input className="input" type="email" value={formData.email}
                            onChange={handleChange}
                            name="email" placeholder="username" />
                        <span className="focus-bg"></span>
                    </div>
                    <div className="input-floating-label">
                        <label><ion-icon name="key-outline"></ion-icon><span>Password</span></label>

                        <input className="input" type="password" value={formData.password} 
                            onChange={handleChange}
                            name="password" placeholder="password" />
                        {/* <label><ion-icon name="key-outline"></ion-icon><span>Password</span></label> */}
                        <span className="focus-bg"></span>
                    </div>
                    <button id="submit" className="btn-submit">
                        Login
                    </button>
            </form>

        </section>
    </div>
  )
}

export default Login
