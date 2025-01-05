import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import api from '@/utils/api';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

function AddContact() {
    const {toast} = useToast()
    const navigate = useNavigate()
    const [companyData, setCompanyData] = useState([]);
    const [companyId, setCompanyId] = useState("");
    const fetchCompaniesAndContactPerson = async() => {
        try {
            const response = await api.get('/company/company');
            const data = await response.data
            // console.log(data.companies)
            setCompanyData(data.companies);
        } catch (error) {
            // console.error('Error:', error);
        }
    }

    useEffect(() => {
        // Fetch All the Company Name and the Contact Person
        fetchCompaniesAndContactPerson()

    }, [])

    const [formData, setFormData] = useState({
        contact_name:"",
        contact_email:"",
        contact_phone_number: "",
        department:""
    });
    

    const handleSubmit= async(e) => {
        console.log(formData)
        e.preventDefault();
        try {
            const response = await api.put(`/company/create-contact/${companyId}`, formData);
            // alert('Contact Added Successfully');
            console.log(response.data)
            setFormData({
                contact_name:"",
                contact_email:"",
                contact_phone_number: "",
                department:""
            });
            toast({
                title: 'Contact Added Successfully',
                variant:"success",
            })
            navigate("/home/company")
        } catch (error) {
            console.error('Error:', error);
        }
    }



  return (
    <div>
      <h2 className='font-semibold text-lg'>Add Contact</h2>
      <hr />
      <form className='my-4' onSubmit={handleSubmit}>
        <div className='flex flex-col my-2'>
            <label className='font-medium py-2'>Company*</label>
            {/* <Input */}
            <select name="company" className='w-max' required onChange={(e) => setCompanyId(e.target.value)}>
                <option value="">Select Company</option>
                {companyData.map(company => (
                    <option key={company._id} value={company._id}>
                    {company.companyName}
                    </option>
                ))}
            </select>
        </div>
        <div className='my-8 grid grid-cols-2 gap-6'>
            
            <div className='flex flex-col my-2'>
                <label>Name:</label>
                <Input type="text" name="contact_name" onChange={(e) =>  setFormData({...formData, [e.target.name]:e.target.value})}/>
            </div>
            <div className='flex flex-col my-2'>
                <label>Email</label>
                <Input type="email" name="contact_email" onChange={(e) =>  setFormData({...formData, [e.target.name]:e.target.value})}/>
            </div>
            <div className='flex flex-col my-2'>
                <label>Phone Number</label>
                <Input type="number" name="contact_phone_number" onChange={(e) =>  setFormData({...formData, [e.target.name]:e.target.value})}/>
            </div>
            <div className='flex flex-col my-2'>
                <label>Department</label>
                <Input type="text" name="department" onChange={(e) =>  setFormData({...formData, [e.target.name]:e.target.value})}/>
            </div>
        </div>
        <Button type="submit">Add Contact</Button>
      </form>
    </div>
  )
}

export default AddContact
