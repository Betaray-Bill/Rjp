import axios from 'axios';
import { useState } from 'react'
import AddCompany from '../../Layout/AddCompany';


function AddEntity() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: [],
      });

      const handleChange = (event) => {
        const { name, value } = event.target;

        if(name == 'role'){
          const selectedRole = event.target.value;
          console.log(selectedRole)
          setFormData((prevData) => {
            // Check if the role is already in the array
            if (!prevData.role.includes(selectedRole)) {
              // Add the new role to the array
              return {
                ...prevData,
                role: [...prevData.role, selectedRole],
              };
            }
            // If already selected, return previous state without change
            return prevData;
          })
          return
        }

    
        setFormData({ ...formData, [name]: value });
      };
      console.log(formData)
      axios.defaults.withCredentials = true;
      const handleSubmit = async (event) => {
        event.preventDefault();
    
        try {
          const response = await axios.post('http://localhost:5000/api/employee/register', formData); // Replace with your API endpoint
          console.log('Registration successful:', response.data);
        } catch (error) {
          console.error('Registration failed:', error);
        }
      };
    
      const roles =  ['ADMIN', 'Manager', 'Trainer Sourcer', 'KeyAccounts']

      const [user, setUser] = useState([])

      const getAll = async() => {
        axios.defaults.withCredentials = true;
            try {
                const response = await axios.get('http://localhost:5000/api/employee/getAll'); // Replace with your API endpoint
                console.log('Registration successful:', response.data);
                setUser(response.data)
              } catch (error) {
                console.error('Registration failed:', error);
              }
      }
  return (
    <div>
      
     
      <AddCompany />
    </div>
  )
}
const styles = {
    userCard: {
      border: '1px solid #ccc',
      padding: '10px',
      marginBottom: '10px',
      borderRadius: '5px'
    }
  };
export default AddEntity
