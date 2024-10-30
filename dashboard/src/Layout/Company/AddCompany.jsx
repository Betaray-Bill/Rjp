import {useState} from 'react';
import axios from 'axios';
import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

function AddCompany() {
    const initialFormData = {
        companyName: '',
        contact_name: '',
        contact_email: '',
        contact_phone_number: ''
    };
    const {toast} = useToast()
    const [formData,
        setFormData] = useState(initialFormData);

    const handleChange = (event) => {
        const {name, value} = event.target;

        // Handle phone number Input (consider validation)
        if (name === 'contact_phone_number') {
            setFormData({
                ...formData,
                [name]: value.replace(/\D/g, '')
            });
            return;
        }

        setFormData({
            ...formData,
            [name]: value
        });
    };

    axios.defaults.withCredentials = true;
    const handleSubmit = async(event) => {
        event.preventDefault();
        if(formData.companyName === undefined || formData.contact_email === undefined || formData.contact_phone_number === undefined || formData.contact_name){
          toast({
                title: "Please Fill All Required Fields",
            })
            return;
        }
        try {
            const response = await axios.post('http://localhost:5000/api/company/create-company', formData); // Replace with your API endpoint
            console.log('Registration successful:', response.data);
            // Handle successful registration (e.g., redirect to login page)
            toast({
                title: "Company Registered",
                description: new Date().toISOString(),
            })
        } catch (error) {
            console.error('Registration failed:', error);
            // Handle registration errors (e.g., display error messages)
        }
    };


    return (
        <div className='border rounded-md mt-10 text-center'>
            <div className='text-center'>
              <h2 className='font-semibold   py-5 text-lg'>Register a Company</h2>
            </div>
            <section className='mt-4 pb-10  grid place-content-center items-center'>
                <form onSubmit={handleSubmit}>
                    <div className='grid grid-cols-2 gap-8'>
                        <div>
                            <Label htmlFor="companyName">Company Name:</Label>
                            <Input
                                type="text"
                                id="companyName"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleChange}
                                required/>
                        </div>

                        <div>
                            <Label htmlFor="contact_name">Contact Name:</Label>
                            <Input
                                type="text"
                                id="contact_name"
                                name="contact_name"
                                value={formData.contact_name}
                                onChange={handleChange}
                                required/>
                        </div>

                        <div>
                            <Label htmlFor="contact_email">Contact Email:</Label>
                            <Input
                                type="email"
                                id="contact_email"
                                name="contact_email"
                                value={formData.contact_email}
                                onChange={handleChange}
                                required/>
                        </div>

                        <div>
                            <Label htmlFor="contact_phone_number">Contact Phone Number:</Label>
                            <Input type="tel" // Use "tel" for phone number Input
                                id="contact_phone_number" name="contact_phone_number" value={formData.contact_phone_number} onChange={handleChange} required/>
                        </div>
                    </div>

                    <div className='flex justify-center items-center mt-9'>
                        <Button type="submit">Register Company</Button>
                    </div>
                </form>
            </section>

            {/* <section>
            <h2>All Companies</h2>
            <button onClick={getAllCompanies}>All Companies</button>
            {
              companies.length > 0 && (
                <div>
                  <h3>Company List</h3>
                  {companies.map((company) => (
                    <div key={company._id}>
                      <h4>{company.companyName}</h4>
                      <p>Contact Name:{company.contact_details.contact_name}</p>
                      <p>Contact Email: {company.contact_details.contact_email}</p>
                      <p>Contact Phone Number: {company.contact_details.contact_phone_number}</p>
                    </div>
                  ))}
                </div>
              )
            }
        </section> */}
        </div>
    );
}

export default AddCompany;
