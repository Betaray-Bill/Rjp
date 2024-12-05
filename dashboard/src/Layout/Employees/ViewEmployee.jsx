import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import React from 'react'
import { useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import EmployeeDetails from './Components/EmployeeDetails';
import Roles from './Components/Roles';

function ViewEmployee() {
  
  const id = useParams()
  console.log(id)
  const navigate = useNavigate();
  // const [collapse, setCollapse] = useState(false)
  const queryClient = useQueryClient();
  const {toast} = useToast()

  const fetchEmp = async () => {
    const response = await axios.get(`http://localhost:5000/api/employee/getemployee/${id.id}`)
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
      <EmployeeDetails data={data && data}/>
      <Roles data={data && data.role}/>
    </div>
  )
}

export default ViewEmployee
