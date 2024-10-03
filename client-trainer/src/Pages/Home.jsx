import React, { useEffect, useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, setCredentials } from '../features/authSlice'
import axios from 'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';

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

function Home() {

  const dispatch = useDispatch();
  const navigate = useNavigate()
  const {user} = useSelector((state)=> state.auth)
  const [data, setData] = useState()
  const [ndaStatus, setNdaStatus] = useState('');
  console.log(user)

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
      console.log(user)
      setData(user)
    }

    if(!data?.nda_Accepted){
      setOpen(true)
      console.log("object")
    }else{
      console.log("yea")
      setOpen(false)
    }
  })


  // Dates
  const [date, setDate] = useState({
    start: new Date(),
    end: new Date()
  })

  // console.log(date.start, date.end)
  axios.defaults.withCredentials = true;
  const handleDate = async(e) => {
    e.preventDefault()
    console.log(date)
    try{
      const res = await axios.post(`http://localhost:5000/api/trainer/trainingDates/${data._id}`, date)
      console.log(res.data)
      if(res){
        getTrainerDetails()

      }
    }catch(err){
      console.log(err)
    }
  }

  console.log(user)

  return (
    <div>
      <nav>
        <h2>RJP Trainers</h2>
        <ul className={{display: 'flex'}}>
            <Link to="/home">Home</Link>  
            <Link to="/home/account">Account</Link>
        </ul>
        <button onClick={signOut}> 
          sign Out
        </button>
      </nav>

      {
        user && <p>NDA Accepted : {data?.nda_Accepted ? "Accepted": "Not Accepted"}</p>
      }

      {
          data && (
            data.type_of_trainer === 'Internal' ? 
            (
              <div>
                <h3>Internal Trainer</h3>
                <p>Welcome {data.name}</p>
                <p>Trainer ID: {data._id}</p>
                <p>Type: {data.type_of_trainer}</p>
                <div>
                  <h3>Training Period</h3>
                  <form onSubmit={handleDate}>
                    <div>
                      <label htmlFor="">Start</label>
                      <input type="date" name="start" id="" onChange={(e) => setDate({...date, [e.target.name]:e.target.value})}/>
                    </div>
                    <div>
                      <label htmlFor="">End</label>
                      <input type="date" name="end" id="" onChange={(e) => setDate({...date, [e.target.name]:e.target.value})}/>
                    </div>
                    <button>Submit</button>
                  </form>
                </div>
                {/* DateRanfg */}
              </div>
            ):null
          ) 
      }

      <Outlet />


      {/* NDA Modal */}
      <Modal
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
      </Modal>
    </div>
  )
}

export default Home
