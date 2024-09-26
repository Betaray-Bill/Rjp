import React, { useEffect, useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, setCredentials } from '../features/authSlice';
import { useQueries, useQuery } from 'react-query';
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

  // Modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // const acceptNda = () => axios.post(`http://localhost:5000/api/trainer/accept-nda?trainerId=${data._id}`);
  // const declineNda = () => axios.post('http://localhost:5000/api/trainer/declineNda', { trainerId: data.trainerId });
  const handleNdaChange = (event) => {
    setNdaStatus(event.target.value);
  };

  axios.defaults.withCredentials = true;
  const handleNdaSubmit= async() => {
    try{
      if (ndaStatus === 'accept'){
        const res = await axios.post(`http://localhost:5000/api/trainer/accept-nda?trainerId=${data && data._id}`)
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
  const signOutFunction = () => {
    return axios.get('http://localhost:5000/api/trainer/signout')
  }

  axios.defaults.withCredentials = true;
  const signOut = async() => {
    console.log("signout")
    const res = await axios.get('http://localhost:5000/api/trainer/signout')
    const d = res.data
    console.log(d)
    dispatch(logout())
    navigate("/login")
  }
  
  useEffect(() => {
    if(user){
      setData(user)
    }

    if(!data?.nda_Accepted){
      setOpen(true)
      console.log("object")
    }else{"yea"
      console.log("yea")
      setOpen(false)
    }
  })

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

      <Outlet />

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
            {data?.name} - {data?._id}, accept your NDA to proceed further with process 
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
