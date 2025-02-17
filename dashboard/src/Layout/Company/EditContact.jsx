import React, { Fragment, useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import api from '@/utils/api'
import { useQueryClient } from 'react-query'
  
function EditContact({company, companyId}) {
    const queryClient = useQueryClient()
  const location = useLocation()
  const [path, setPath] = useState([])
    const [formData, setFormData] = useState({
        contactName:company.contactName,
        contactEmail:company.contactEmail,
        contactPhoneNumber: company.contactPhoneNumber,
        department:company.department
    })

    const updateData = async(e) => {
        console.log(formData)
        e.preventDefault();
        try {
            const response = await api.put(`/company/edit-contact/${companyId}`, formData);
            // alert('Contact Added Successfully');
            console.log(response.data)
            setFormData({
                contactName:'',
                contactEmail:'',
                contactPhoneNumber: '',
                department:''
            });
            queryClient.invalidateQueries(['ViewCompanies'])
          
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return ( 
        <div>
            <div>
                <div>
                    <Input className="my-1 text-black" name="contactName"  value={formData.contactName} onChange={(e) =>  setFormData({...formData, [e.target.name]:e.target.value})} />
                </div>
                <div>
                    <Input className="my-1 text-black" name="contactEmail" value={formData.contactEmail} onChange={(e) =>  setFormData({...formData, [e.target.name]:e.target.value})} />
                </div>
                <div>
                    <Input className="my-1 text-black" name="contactPhoneNumber" value={formData.contactPhoneNumber} onChange={(e) =>  setFormData({...formData, [e.target.name]:e.target.value})}/>
                </div>
                <div>
                    <Input className="my-1 text-black" name="department"  value={formData.department} onChange={(e) =>  setFormData({...formData, [e.target.name]:e.target.value})} />
                </div>
            </div>
            {/* {
                JSON.stringify(formData)
            } */}
            <Button onClick={updateData}>Update</Button>
        </div>
    )
}

export default EditContact