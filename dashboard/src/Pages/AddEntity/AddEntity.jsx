import axios from 'axios';
import { useState } from 'react'
import AddCompany from '../../Components/AddCompany';


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
      
      <section>
        <h2>Add Employees, Company</h2>

        <form onSubmit={handleSubmit}>
            <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

            <label htmlFor="email">Email:</label>
            <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
            />

            <label htmlFor="password">Password:</label>  

            <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}  

                required
            />

            <label htmlFor="role">Role:</label>
            <select id="role" name="role" onChange={handleChange}>
                 <option></option>
                {roles.map((role) => (
                <option key={role} value={role}>
                    {role}
                </option>
                ))}
            </select>
            {
              formData && formData.role.map((e, _i) => (
                <span key={_i}>{e},</span>
              ))
            }

            {/* <label>Authorizations:</label>
            <div>
                <input
                type="checkbox"
                id="trainerRegister"
                name="authorizations"
                value="Trainer Register"
                checked={formData.authorizations.includes('Trainer Register')}
                onChange={handleChange}
                />
                <label htmlFor="trainerRegister">Trainer Register</label>
            </div>
            <div>
                <input
                type="checkbox"
                id="sendPO"
                name="authorizations"
                value="Send PO"
                checked={formData.authorizations.includes('Send PO')}
                onChange={handleChange}
                />
                <label htmlFor="sendPO">Send PO</label>
            </div>
            <div>
                <input
                type="checkbox"
                id="Create Deal"
                name="authorizations"
                value="Create Deal"
                checked={formData.authorizations.includes('Create Deal')}
                onChange={handleChange}
                />
                <label htmlFor="Create Deal">Create Deal</label>
            </div> */}
           

            <button type="submit">Register</button>
        </form>
      </section>

      <section>
        <h2>All Employees </h2>
        <button onClick={getAll}>Get All Employees</button>
        <h1>Users List</h1>
            {user.map((user) => (
                <div key={user._id} style={styles.userCard}>
                <h2>{user.name}</h2>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role.name}</p>
                <p><strong>Authorizations:</strong></p>
                <ul>
                    {user.authorizations.map((auth, index) => (
                    <li key={index}>{auth}</li>
                    ))}
                </ul>
                <p><strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}</p>
                <p><strong>Updated At:</strong> {new Date(user.updatedAt).toLocaleString()}</p>
                </div>
            ))}
      </section>

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
