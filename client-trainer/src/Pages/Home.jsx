import React, { useEffect, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, setCredentials } from '../features/authSlice'
import logo from "../assets/logo.png"
import { Button } from "@/components/ui/button"
import axios from 'axios';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const dateRanges = [
  { start: "2024-10-01", end: "2024-10-05", Deal: 1 },
  { start: "2024-10-10", end: "2024-10-15", Deal: 2 },
  { start: "2024-11-05", end: "2024-11-09", Deal: 3 },
];
function Home() {
  const location = useLocation(); // Get the current URL
  // Helper function to check if the current path matches the given path
  const isActive = (path) =>{
    // if(location.pathname.split("/").includes("resume")){
    //   console.log(location.pathname.split("/").includes("resume"))
    //   return true
    // }
    return location.pathname.split('/')[location.pathname.split('/').length -1] === path
  };
  
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const {user} = useSelector((state)=> state.auth)
  const [data, setData] = useState()
  const [ndaStatus, setNdaStatus] = useState('');
  // console.log(user)

  axios.defaults.withCredentials = true;
  const getTrainerDetails = async() => {
    console.log(data._id)

    try{
      const res = await axios.get(`http://localhost:5000/api/trainer/details/${data._id}`)
      console.log(res.data)
      setData(res.data)
      dispatch(setCredentials(res.data))
    }catch(err){
      console.log("Error fetching the data")
    }
  }


  // Modal
  const [open, setOpen] = React.useState(false);
  const handleNdaChange = (event) => {
    setNdaStatus(event.target.value);
  };

  axios.defaults.withCredentials = true;
  const handleNdaSubmit= async() => {
    try{
      if (ndaStatus === 'accept'){
        const res = await axios.post(`http://localhost:5000/api/trainer/accept-nda?trainerId=${data._id}`)
        const resData = res.data
  
        console.log(resData.trainer) 
        dispatch(setCredentials(resData.trainer)) 
        setOpen(close)
      }else{
        signOut()
      }
    }catch(err){
      console.log("Error in submitting the NDA ---> ", err)
    }
  }

  // Sign out

  axios.defaults.withCredentials = true;
  const signOut = async() => {
    console.log("signout")
    await axios.get('http://localhost:5000/api/trainer/signout')
    dispatch(logout())
    navigate("/login") 
  }
  
  useEffect(() => {
    if(user){
      // getTrainerDetails()  
      console.log(user)
      setData(user)
    }else{
      navigate("/login")
    }

    if(!data?.nda_Accepted){
      setOpen(true)
      console.log("object")
    }else{
      console.log("yea")
      setOpen(false)
    }
  }, [])

  useEffect(() => {
    // getTrainerDetails()
  }, [])


  const [currentTime, setCurrentTime] = useState(new Date());

  return (
    <div className='flex w-screen h-screen overflow-hidden'>
      {/* SideBar */}
      <div className='w-[250px] h-screen bg-white p-4'>
        {/* Sidebar Logo */}
        <div className='flex pb-4 justify-between items-start'>
          <img src={logo} alt="Rjp Logo" className='w-30 h-11'/>
        </div>

        <div className='flex flex-col mt-10 justify-between'>
          <div className='flex flex-col justify-between'>
            <ul className='flex flex-col justify-between'>
              <Link to="/home/dashboard"
              className={`pt-2 pb-2 mt-2 pl-2 rounded-sm flex items-center text-gray-800 ${
                  isActive('dashboard') ? 'bg-customGray' : 'bg-white'
                }`}
              >
               <ion-icon name="home-outline"></ion-icon> <span className='ml-3'>Home</span>
              </Link>
              <Link to="/home/resume"
                className={`pt-2 pb-2 mt-2 pl-2 rounded-sm  flex items-center ${
                  isActive('resume') ? 'bg-customGray' : 'bg-white'
                }`}
              >
                <ion-icon name="newspaper-outline"></ion-icon><span className='ml-3'>Resume</span>   
              </Link>
              <Link to="/home/account"
                className={`pt-2 pb-2 mt-2 pl-2 rounded-sm flex items-center ${
                  isActive('account') ? 'bg-customGray' : 'bg-white'
                }`}
              >
                <ion-icon name="person-outline"></ion-icon><span className='ml-3'>Profile</span>
              </Link>
              
            </ul>
          </div>
        </div>

        <div className='mb-2 absolute bottom-4'>
          <div className='text-left flex flex-col'>
           {/* <span className='text-sm'>{currentTime.toLocaleTimeString()}</span> */}
           <span className='text-sm mt-2'>{currentTime.toLocaleDateString()}</span>
          </div>
        </div>

      </div>

      {/* Main Section */}
      <div className='overflow-y-scroll bg-customBg w-screen rounded-md mt-2 mb-2 mr-2 border border-gray-400'>
        {/* Main Section Nav */}
        <div className='w-full h-14 border-b border-gray-400 p-4 '>
          <div className='flex items-center justify-end'>
            <p className='font-light text-sm'>Welcome { data && data.name}</p>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <img src="data:image/png;base64,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" 
                  alt="trainer_profile photo" 
                  className='w-8 h-8 rounded-full ml-2 border border-black'
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel className="font-normal">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>
                  <Button onClick={signOut}>Sign Out</Button>
                </DropdownMenuLabel>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {/* Outlet */}
        <Outlet />
      </div>

      {/* <nav>
        <h2>RJP Trainers</h2>
        <ul className={{display: 'flex'}}>
            <Link to="/home/dashboard">Home</Link>  
            <Link to="/home/account">Account</Link>
        </ul>
        <button onClick={signOut}> 
          sign Out
        </button>
      </nav>

      {
        user && <p>NDA Accepted : {data?.nda_Accepted ? "Accepted": "Not Accepted"}</p>
      } */}

      {/* <Outlet /> */}

      {/* NDA Modal */}
      {/* <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Non Disclosure Agreement
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {data && data?.name}, accept your NDA to proceed further with process 
          </Typography>
          <FormControl component="fieldset">
            <RadioGroup
              aria-label="nda"
              name="nda"
              value={ndaStatus}
              onChange={handleNdaChange}
            >
              <FormControlLabel value="accept" control={<Radio />} label="Accept" />
              <FormControlLabel value="decline" control={<Radio />} label="Decline" />
            </RadioGroup>
            <Button onClick={handleNdaSubmit} variant='contained' color="primary">
              Submit
            </Button>
          </FormControl>
          
        </Box>
      </Modal> */}
    </div>
  )
}

export default Home
