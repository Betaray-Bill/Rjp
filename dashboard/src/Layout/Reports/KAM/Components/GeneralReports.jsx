import React, {Fragment, useEffect, useState} from 'react'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import axios from 'axios'
import {Input} from '@/components/ui/input'
import {Button} from '@/components/ui/button'
import {Label} from '@/components/ui/label'
import {useSelector} from 'react-redux'
import {userAccess} from '@/utils/CheckUserAccess'
import {RolesEnum} from '@/utils/constants'
import RevenueResult from '../../Deals/Components/Revenue/RevenueResult'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"

function GeneralReports() {

  const {currentUser} = useSelector(state => state.auth)

    const [option,
        setOption] = useState("")

    const [companyData,
        setCompanyData] = useState([])

    const [kamData,
        setKamData] = useState([])

    const [startDate,
        setStartDate] = useState("");
    const [endDate,
        setEndDate] = useState("");
    const [company,
        setCompany] = useState("")
    const [kam,
        setKam] = useState("")
    const [result,
        setResult] = useState([])

    useEffect(() => {
        if (userAccess([RolesEnum.ADMIN], currentUser
            ?.employee.role)) {
            // fetchCompany()
            fetchKAM()
        }else{
            setKam(currentUser
                ?.employee._id)

            submitKamRevenueHandler(currentUser
                ?.employee._id)
        }
        fetchCompany()
    }, [])

    const fetchKAM = async() => {
        // Fetch client data from API
        try {
            const response = await axios.get('http://localhost:5000/api/employee/getkeyAccounts');
            const data = await response.data;
            console.log(data)
            setKamData(data);

        } catch (error) {
            console.error('Error:', error);
        }
    }

    const fetchCompany = async() => {
        // Fetch client data from API
        try {
            const response = await axios.get('http://localhost:5000/api/company/getAll-company');
            const data = await response.data;
            console.log(data)
            setCompanyData(data);

        } catch (error) {
            console.error('Error:', error);
        }
    }

    // fetchCompany()

    console.log(kam)
    console.log(companyData)


    const submitKamRevenueHandler = async(id) => {
        try {
            if (!kam && !id) {
                console.error("KAM is null. Cannot proceed.");
                return; // Exit the function if kam is null
            }
            let ID = kam ? kam : id


            const params = new URLSearchParams();

            if (startDate) 
                params.append("startDate", startDate);
            if (endDate) 
                params.append("endDate", endDate);
            if (company) 
                params.append("company", company);

            // Construct URL dynamically based on params
            const url = `http://localhost:5000/api/reports/get-general-reports/${ID}${params.toString()
                ? `?${params.toString()}`
                : ""}`;

            const response = await axios.get(url);
            const data = response.data; // No need for `await` here, `response.data` is already resolved
            console.log(data);
            setResult(data);
        } catch (error) {
            console.error("Error:", error);
        }
    };


  return (
    <div className='mt-5'>
      <h2 className='my-3 font-semibold ml-2'>General Reports</h2>
      {userAccess([RolesEnum.ADMIN], currentUser
                ?.employee.role) && (
                <Fragment>
                    {< div className = "mx-2" > <Select onValueChange={(e) => setKam(e)} value={kam}>
                        <SelectTrigger className="w-max ">
                            <SelectValue
                                placeholder={kam
                                ? kam
                                : "Select KAM"}/>
                        </SelectTrigger>
                        <SelectContent>
                            {kamData && kamData
                                ?.map((k) => (
                                    <SelectItem value={k._id} key={k._id}>{k.email}</SelectItem>

                                ))
}
                        </SelectContent>
                    </Select> 
                    </div>}
                </Fragment>

            )
}
            <div className='flex items-center justify-start mt-5'>
                {/* Filters */}
                {kam && (
                    <Fragment>
                        <div className="mx-2">
                            <Input
                                className="w-max"
                                type="date"
                                id="startDate"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}/>
                        </div>

                        <div className="mx-2">
                            <Input
                                className="w-max"
                                type="date"
                                id="endDate"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}/>
                        </div>

                        <Select onValueChange={(e) => setCompany(e)} value={company}>
                                                <SelectTrigger className="w-max min-w-[150px]">
                                                    <SelectValue placeholder="Select Client"/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {companyData && companyData
                                                        ?.map((company) => (
                                                            <SelectItem value={company.companyName} key={company.companyName}>{company.companyName}</SelectItem>
                        
                                                        ))
                        }
                                                </SelectContent>
                                            </Select>

                        <div className="mx-2">
                            <Button onClick={submitKamRevenueHandler}>Submit</Button>
                        </div>

                    </Fragment>
                )
}
 

            </div>

            {/* {result && result.length > 0 && <RevenueResult result={result}/>
        } */}
        {
          result && result.length > 0 && (
                    <div className='mt-5'>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>S.no</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Company</TableHead>
                                    <TableHead>Number of Training</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {result && (result.map((e, _i) => (
                                    <TableRow>
                                        <TableCell>{_i + 1}</TableCell>
                                        <TableCell className="font-semibold">{}</TableCell>
                                        <TableCell> Email</TableCell>
                                        <TableCell>{e._id}</TableCell>
                                        <TableCell>{e.projectNames.length}</TableCell>
                                    </TableRow>
                                )))
            }
            
                                
                            </TableBody>
                        </Table>
            
                    </div>
                    )
        }
        </div>

  )
}

export default GeneralReports
