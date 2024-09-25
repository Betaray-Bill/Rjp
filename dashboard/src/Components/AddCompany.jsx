import React, { useState } from 'react';
import axios from 'axios';

function AddCompany() {
  const initialFormData = {
    companyName: '',
    contact_name: '',
    contact_email: '',
    contact_phone_number: '',
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (event) => {
    const { name, value } = event.target;

    // Handle phone number input (consider validation)
    if (name === 'contact_phone_number') {
      setFormData({ ...formData, [name]: value.replace(/\D/g, '') });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  axios.defaults.withCredentials = true;
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/employee/create-company', formData); // Replace with your API endpoint
      console.log('Registration successful:', response.data);
      // Handle successful registration (e.g., redirect to login page)
    } catch (error) {
      console.error('Registration failed:', error);
      // Handle registration errors (e.g., display error messages)
    }
  };

    axios.defaults.withCredentials = true;
    const getAllCompanies= async() => {
        try{
            const res = await axios.get('http://localhost:5000/api/employee/company/getAllCompany')
            const data = await res.data
            console.log(data)
        }catch(err){
            console.log(err)
        }
    }

  return (
    <div>
        <section>
            <form onSubmit={handleSubmit}>
                <label htmlFor="companyName">Company Name:</label>
                <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="contact_name">Contact Name:</label>
                <input
                    type="text"
                    id="contact_name"
                    name="contact_name"
                    value={formData.contact_name}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="contact_email">Contact Email:</label>
                <input
                    type="email"
                    id="contact_email"
                    name="contact_email"
                    value={formData.contact_email}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="contact_phone_number">Contact Phone Number:</label>
                <input
                    type="tel" // Use "tel" for phone number input
                    id="contact_phone_number"
                    name="contact_phone_number"
                    value={formData.contact_phone_number}
                    onChange={handleChange}
                    required
                />

                <button type="submit">Register Company</button>
            </form>
        </section>

        <section>
            <h2>All Companies</h2>
            <button onClick={getAllCompanies}>All Companies</button>
        </section>
    </div>
  );
}

export default AddCompany;
