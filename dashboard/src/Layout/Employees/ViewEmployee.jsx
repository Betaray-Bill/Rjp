import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import React from 'react'
import { useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import EmployeeDetails from './Components/EmployeeDetails';
import Roles from './Components/Roles';
import { useSelector } from 'react-redux';
import api from '../../utils/api';

function ViewEmployee() {
  
  const id = useParams()
  console.log(id)
  const navigate = useNavigate();
  // const [collapse, setCollapse] = useState(false)
  const queryClient = useQueryClient();
  const {toast} = useToast()
  const {currentUser} = useSelector(state => state.auth)
  const token = localStorage.getItem('empToken'); // Get the token from localStorage (or any storage)
  console.log("TOke is", token)
  console.log(currentUser)
  const fetchEmp = async () => {
    const response = await api.get(`/employee/getemployee/${id.id}`)
    console.log(response.data.message)
    return response.data.message
  }

  const { data, isLoading, error } = useQuery(
    ['ViewEmp', id.id], 
    
    fetchEmp,
    {
      enabled: !!id.id,
      staleTime: 1000 * 60 * 5, // data stays fresh for 5 minutes
      cacheTime: 1000 * 60 * 10 // cache data for 10 minutes
    }
  )

  if(isLoading){
    return "Loading..."
  }
  return (
    <div>
      {/* hi {
        id.id
      } */}
      <EmployeeDetails data={data && data}/>
      <Roles data={data && data.role}/>
    </div>
  )
}

export default ViewEmployee
