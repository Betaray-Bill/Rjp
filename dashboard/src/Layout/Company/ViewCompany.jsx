import axios from 'axios'
import React, {useEffect, useState} from 'react'
import {useQuery} from 'react-query'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import api from '@/utils/api'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import EditContact from './EditContact'
import { useToast } from '@/hooks/use-toast'
  

function ViewCompany() {
    const {toast} = useToast()
    // con
    const fetchAllCompanies = async() => {
        try {
            const response = await api.get(`/company/company`)
            console.log(response.data.companies)
            return response.data.companies
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    
    const {data: companies, isLoading, error} = useQuery(['ViewCompanies'], fetchAllCompanies, {
        // enabled: !!projectId.projectId,
        staleTime: 1000 * 60 * 5, // data stays fresh for 5 minutes
        cacheTime: 1000 * 60 * 10 // cache data for 10 minutes
    })

    const [selectedClient,
        setSelectedClient] = useState('')

    const [clients, setClient] = useState([])
    const [companyId, setcompanyId] = useState('')


    const handleClient = (e) => {
        console.log(e)
        setSelectedClient(e)
        if(e){
            const selectedCompany = companies.filter((company) => company.companyName == e)
            setClient(selectedCompany[0].contact_details)
            setcompanyId(selectedCompany[0]._id)
            console.log(selectedCompany)
        }
    }


    const deleteContact = async(e) => {
        // console.log(formData)
        // e.preventDefault();
        try {
            const response = await api.delete(`/company/delete-contact/${companyId}/${e}`);
            alert('Contact Deleted Successfully');
            
          
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <div> 
            {/* {isLoading && <div>Loading...</div>} */}

            <div className='flex items-center'>
                <h2 className='text-lg font-semibold'>View Clients</h2>
                <div className='ml-4'>
                    {companies && (
                        <Select onValueChange={(e) => handleClient(e)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select Client"/>
                            </SelectTrigger>
                            <SelectContent>
                                {/* <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="system">System</SelectItem> */}
                                {companies.map((company, index) => (
                                    <SelectItem value={company.companyName} key={company.companyName}>{company.companyName}</SelectItem>
                                ))
}
                            </SelectContent>
                        </Select>
                    )
}

                </div>
            </div>

            { clients && (
                <div className='mt-4'>
                    <div>
                        <Input placeholder="Search Contact Person" />
                    </div>
                    {/* <h2 className='mt-4 font-semibold text-md'>{selectedClient}</h2> */}
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Contact Name</TableHead>
                                <TableHead>Contact Email</TableHead>
                                <TableHead>Contact Phone</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead></TableHead>
                                <TableHead></TableHead>
                                {/* <TableHead>Department</TableHead> */}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            { clients?.map((company,index) =>  (
                                <TableRow key={index}>
                                    <TableCell>{company.contactName}</TableCell>
                                    <TableCell>{company.contactEmail}</TableCell>
                                    <TableCell>{company.contactPhoneNumber}</TableCell>
                                    <TableCell>{company.department || "N/A"}</TableCell>
                                    <TableCell>
                                        <div className='flex items-center'>
                                            {/* <Button className="mx-2 border-none border-radius-none">Edit</Button> */}
                                            <Dialog>
                                                <DialogTrigger>
                                                    <Button className="mx-2 border-none border-radius-none">Edit</Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                    <DialogTitle>Edit Contact Details</DialogTitle>
                                                    <DialogDescription>
                                                        <EditContact company={company} companyId={companyId}/>
                                                    </DialogDescription>
                                                    </DialogHeader>
                                                </DialogContent>
                                            </Dialog>

                                            <div>
                                                <ion-icon name="trash-outline" style={{color:'red', fontSize:"20px"}} onClick={() => deleteContact(company._id)}></ion-icon>
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )
}
        </div>
    )
}

export default ViewCompany