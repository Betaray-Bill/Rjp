import React, {Fragment, useEffect, useState} from 'react'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import axios from 'axios'
import {Input} from '@/components/ui/input'
import {Button} from '@/components/ui/button'
import {Label} from '@/components/ui/label'
import {useSelector} from 'react-redux'
import {userAccess} from '@/utils/CheckUserAccess'
import {RolesEnum} from '@/utils/constants'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import * as XLSX from 'xlsx';
import api from '@/utils/api'
  
function TrainerDeployed() {
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
            fetchTrainerSourcer()
            // fetchCompany()
        }else{
            setKam(currentUser
                ?.employee._id)
                // fetchCompany()
            submitKamRevenueHandler(currentUser
                ?.employee._id)
        }
        // fetchCompany()
    }, [])

    const fetchTrainerSourcer = async() => {
        // Fetch client data from API
        try {
            const response = await api.get('/employee/gettrainerSourcer');
            const data = await response.data;
            console.log(data)
            setKamData(data);

        } catch (error) {
            console.error('Error:', error);
        }
    }

      useEffect(() => {
            if(kam){
                // setOption()
                const name = kamData.filter(e => e._id === kam)
                console.log(name)
                setOption(name)
            }
        }, [kam])



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


            // Construct URL dynamically based on params
            const url = `/reports/trainer-sourcer/deployed/${ID}${params.toString()
                ? `?${params.toString()}`
                : ""}`;

            const response = await api.get(url);
            const data = response.data; // No need for `await` here, `response.data` is already resolved
            console.log(data);
            setResult(data);
        } catch (error) {
            console.error("Error:", error);
        }
    };


    const handleDownload = () => {
        // Prepare data for Excel
        const data = []
        // data.push({
        //     "S.no": 1,
        //     "Trainer Sourcer":"",
        //     "Start Date": startDate,
        //     "End Date": endDate,
        //     "Deployed": e.totalTrainersDeployed,
        // });
    
        // Add a row for totals (if applicable)
        data.push({
            "S.no": "Total",
            "Trainer Sourcer": option[0].name,
            "Start Date": startDate,
            "End Date": endDate,
            "Deployed": result. totalTrainersDeployed,
        });
    
        // Create a worksheet
        const worksheet = XLSX.utils.json_to_sheet(data);
    
        // Create a workbook and add the worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Trainer Deployment");
    
        // Export to Excel
        XLSX.writeFile(workbook, "Trainer_Deployment_Report.xlsx");
    };
    

        console.log(result)

  return (
       <div className='mt-5'>
           <h2 className='my-3 font-semibold ml-2'>Trainers Deployed</h2>
           {userAccess([RolesEnum.ADMIN], currentUser
               ?.employee.role) && (
               <Fragment>
                   {< div className = "mx-2" > <Select onValueChange={(e) => setKam(e)} value={kam}>
                       <SelectTrigger className="w-max ">
                           <SelectValue
                               placeholder={kam
                               ? kam
                               : "Select Trainer Sourcer"}/>
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
       
                       <div className="mx-2">
                           <Button onClick={submitKamRevenueHandler}>Submit</Button>
                       </div>
       
                   </Fragment>
               )
       }
       
       
           </div>

       
           {result &&  
           
           <Fragment>
            <div className='flex items-center justify-end  '>
           <Button onClick={handleDownload}>Download</Button>
       </div>
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead >Trainer Sourcer</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead className="text-right">Deployed</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                <TableCell className="font-medium">{option[0]?.name}</TableCell>
                <TableCell>{startDate}</TableCell>
                <TableCell>{endDate}</TableCell>
                <TableCell className="text-right">{result.totalTrainersDeployed}</TableCell>
                </TableRow>
            </TableBody>
            </Table>
           </Fragment>
         }
       
       </div>
  )
}

export default TrainerDeployed