import axios from 'axios'
import React from 'react'
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

function ViewCompany() {

    const fetchAllCompanies = async() => {
        try {
            const response = await axios.get(`http://localhost:5000/api/company/company`)
            console.log(response.data.companies)
            return response.data.companies
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    // http://localhost:5000/api/company/company
    const {data: companies, isLoading, error} = useQuery(['ViewCompanies'], fetchAllCompanies, {
        // enabled: !!projectId.projectId,
        staleTime: 1000 * 60 * 5, // data stays fresh for 5 minutes
        cacheTime: 1000 * 60 * 10 // cache data for 10 minutes
    })

    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className= "">Invoice</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell className="font-medium">INV001</TableCell>
                        <TableCell>Paid</TableCell>
                        <TableCell>Credit Card</TableCell>
                        <TableCell className="text-right">$250.00</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
          {
          //  companies &&  JSON.stringify(companies)
          }
        </div>
    )
}

export default ViewCompany
