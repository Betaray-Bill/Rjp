import React, { useState } from 'react'
import { useSelector } from 'react-redux'
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
// import Modal from '@mui/material/Modal';
// import { height } from '@mui/system';
import axios from 'axios';
import PersonalDetails from '@/Layout/Accounts/PersonalDetails';
import BankDetails from '@/Layout/Accounts/BankDetails';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from "@/components/ui/card";
import { PencilLine, Upload } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '  70vw',
  height:'70vh',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  overflowY: 'scroll',
  boxShadow: 24,
  p: 4,
};
 
function Account() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

    const {user}  = useSelector(state => state.auth)
    const renderArray = (arr) => {
        return arr.map((item, index) => item && <li key={index}>{item}</li>);
      };
    
      const renderObject = (obj) => {
        return Object.keys(obj).map((key) => (
          <div key={key}>
            <strong>{key.replace(/_/g, ' ')}:</strong> {obj[key]}
          </div>
        ));
      };

    function convertDate(dateStr) {
        // Check if dateStr is a string, and then convert it to a Date object
        const date = new Date(dateStr);
      
        // Verify that 'date' is a valid Date object
        if (isNaN(date.getTime())) {
          throw new Error('Invalid Date');
        }
      
        // Extract day, month, and year from the Date object
        const day = date.getUTCDate(); // For local time, use date.getDate()
        const month = date.getUTCMonth() + 1; // Months are zero-indexed, so add 1
        const year = date.getUTCFullYear(); // For local time, use date.getFullYear()
      
        // Format the date as DD/MM/YYYY
        const formattedDate = `${day}/${month}/${year}`;
      
        return formattedDate;
    }


    // Edit Handle
    // const [formData, setFormData] = useState(trainerData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [formData, setFormData] = useState(user);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleArrayChange = (e, section) => {
    const { value, name } = e.target;
    const updatedArray = [...formData[section]];
    console.log(e, section)
    updatedArray[name] = value;
    setFormData((prevData) => ({
      ...prevData,
      [section]: updatedArray,
    }));
  };

    axios.defaults.withCredentials = true;
    const handleSubmit = async(e) => {
      e.preventDefault();
      // console.log('Form Data Submitted:', formData);
      // // Perform API call to save form data
      // try {
      //     const response = await axios.post('http://localhost:5000/api/trainersourcer/register-trainer', formData); // Replace with your API endpoint
      //     console.log('Registration successful:', response.data);
      //     // setUser(response.data)
      // }catch (error) {
      //     console.error('Registration failed:', error);
      // }
    };
    
    console.log(user)

  return (
    <div className='grid w-full place-content-center my-4'>
      <p className='text-md text-gray-700 mt-4 pb-[-2] font-semibold'>Accounts</p>

      <div className='mt-8'>
        <Card className="w-[80vw]">
          <CardContent className="flex flex-col p-4">
            <div className="flex items-center w-full mb-4">
              <Avatar className="h-12 w-12 mr-4 ">
                <AvatarImage src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" alt={user.generalDetails.name} />
                <AvatarFallback>{user.generalDetails.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium">{user.generalDetails.name}</p>
                <Button variant="outline" size="sm" className="mt-2">
                  <PencilLine className="h-4 w-4 mr-2"/>
                  Update Picture
                </Button>
              </div>
              <Button variant="outline" size="sm">
                <PencilLine className="h-4 w-4 mr-2"/>
                change Password 
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className='w-[80vw] mt-8 p-6 bg-white rounded-md'>
        Personal Info

        <Card className="mx-auto mt-4">
          <CardContent className="grid grid-cols-3 gap-6 p-6">
            <div className="space-y-2">
              <Label className="text-slate-700" htmlFor="name">Name</Label>
              <Input id="name" value={user.generalDetails.name} readOnly/>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700" htmlFor="trainerId">Trainer ID</Label>
              <Input id="trainerId" value={user.trainerId} readOnly/>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700" htmlFor="dob">Date of Birth</Label>
              <Input id="dob" type="date" readOnly/>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700" htmlFor="mobileNumber">Mobile Number</Label>
              <Input id="mobileNumber" value={user.generalDetails.phoneNumber} readOnly/>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700" htmlFor="alternateNumber">Alternate Number</Label>
              <Input id="alternateNumber" value={user.generalDetails.alternateNumber} readOnly/>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700" htmlFor="whatsappNumber">WhatsApp Number</Label>
              <Input id="whatsappNumber" value={user.generalDetails.whatsappNumber} readOnly/>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700" htmlFor="emailId">Email ID</Label>
              <Input id="emailId" type="email" value={user.generalDetails.email} readOnly/>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='w-[80vw] mt-8 p-6 bg-white rounded-md'>
        Bank Details

        <Card className="mx-auto mt-4">
          <CardContent className="grid grid-cols-3 gap-6 p-6">
            <div className="space-y-2">
              <Label className="text-slate-700" htmlFor="AccountName">Account Name</Label>
              <Input id="AccountName" value={user.bankDetails.accountName} readOnly/>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700" htmlFor="AccountNumber">Account Number</Label>
              <Input id="AccountNumber" value={user.bankDetails.accountNumber} readOnly/>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700" htmlFor="BankName">Bank Name</Label>
              <Input id="BankName" value={user.bankDetails.bankName} readOnly/>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700" htmlFor="Branch">Branch</Label>
              <Input id="Branch" value={user.bankDetails.bankBranch} readOnly/>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700" htmlFor="IFSCCode">IFSC Code</Label>
              <Input id="IFSCCode" value={user.bankDetails.bankIFSCCode} readOnly/>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700" htmlFor="PancardNumber">Pancard Number</Label>
              <Input id="PancardNumber" value={user.bankDetails.pancardNumber} readOnly/>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700" htmlFor="GSTNumber">GST Number</Label>
              <Input id="GSTNumber" value={user.bankDetails.gstNumber} readOnly/>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700" htmlFor="Aadhar">Aadhar</Label>
              <Input id="Aadhar" value={user.bankDetails.aadharCardNumber} readOnly/>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700" htmlFor="VendorName">Vendor Name</Label>
              <Input id="VendorName" value={user.bankDetails.vendorName} readOnly/>
            </div>
          </CardContent>
        </Card>
      </div>
      <p className='text-end text-red-500 mt-10'>To update your details please contact the company</p>
    </div>
  )
}

export default Account
