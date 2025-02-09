import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { setResumeDetails } from '@/features/trainerSlice';
import { useToast } from '@/hooks/use-toast';
import api from '@/utils/api';
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

function BankDetails({data, name}){
    const trainerId = useParams()
    const queryClient = useQueryClient()
    const dispatch = useDispatch();
    const {trainerDetails} = useSelector(state => state.trainer)
    const {toast} = useToast()
    const [isEdit,
        setIsEdit] = useState(false)
    console.log("Trainer Details ", trainerDetails)
    const [bankDetails,
        setBankDetails] = useState({
            accountName: "",
            accountNumber: Number(),
            bankName: "",
            bankBranch: "",
            bankIFSCCode: "",
            pancardNumber: "",
            aadharCardNumber: "",
            gstNumber: "",
            panCard:"",
            aadharCard:"",
            vendorName: "",
            sameasVendor:false
    })

    useEffect(() => {
        if (data) {
            console.log(data)
            setBankDetails(data)
        }
    }, [data])

    const handleChange = (event) => {
        const updatedbankDetails = {
            ...bankDetails,
            [event.target.name]: event.target.value
        }
        setBankDetails(updatedbankDetails);
        dispatch(setResumeDetails({name: "bankDetails", data: updatedbankDetails}))
    }

    const AadharCardRef = useRef()    
    const PanCardRef = useRef()    
    const [pan, setPan] = useState()
    const [aadharCard, setAadharCard] = useState()


    
    const handleFileChange = async(event, name) => {
        const file = event.target.files[0];
        console.log("INSIDE the file: " + file)
        if(name === "pancard"){
            setPan(file)
            const updatedBankDetails = {...bankDetails, panCard : file}
            setBankDetails(updatedBankDetails);
            // dispatch(setResumeDetails({
            //   name:"bankDetails",
            //   data:updatedBankDetails
            // }))
        }else{
            setAadharCard(file)
            const updatedBankDetails = {...bankDetails, aadharCard : file}
            setBankDetails(updatedBankDetails);
            // dispatch(setResumeDetails({
            //   name:"bankDetails",
            //   data:updatedBankDetails
            // }))
        }
    };


    const submitHandler = async(e) => { 
        try {
            console.log("object ", bankDetails)
            // let updateData = {...bankDetails};
            let updateData
            if(bankDetails.vendorName){
                updateData.accountName = bankDetails.vendorName
            }
            if (bankDetails.aadharCard === "" || bankDetails.panCard === "" || bankDetails.aadharCard === undefined || bankDetails.panCard === undefined) {
               
                updateData = {...bankDetails};

            } else {
                console.log("Checking blob connection...");
                const result = await api.get('/filestorage/check-blob-connection');
                const response = result.data;
                console.log("Connection check result:", response);
                console.log(typeof bankDetails.aadharCard)
                console.log(typeof bankDetails.panCard)


                if (result.status == 200) {
                    console.log("File is present. Sending data to another API...");

                    // Call another POST API Create a FormData object to handle file upload
                    const formData = new FormData();
                    if(typeof bankDetails.aadharCard    == "object"){
                    formData.append("aadharCard", bankDetails.aadharCard);
}
                     // if(typeof bankDetails.panCard == "object"){
                     console.log("pancard", bankDetails.panCard);
                    formData.append("pancard", bankDetails.panCard);
                // }

                    console.log(formData)
                    // Additional metadata Call the POST API to upload the file
                    const uploadResult = await api.post(`/filestorage/upload-aadhar-pan/trainer/${name}`, {
                        pancard: bankDetails.panCard,
                        // aadharCard: bankDetails.aadharCard
                    }, {
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    });

                    const res = uploadResult.data
                    console.log(res)

                    if(res.panCard){
                        console.log("PAN CARD", res.panCard)
                        updateData = {...bankDetails,  panCard: res.panCard}
                    }

                    if(res.aadharCard){
                     updateData = {...bankDetails,aadharCard: res.aadharCard}
                     // console.log("PAN CARD", res.panCard)
                         
                    }
                   
                    //  updateData = {...bankDetails,aadharCard: res.aadharCard}

            // let updateData = {...bankDetails}

                    // // Upload trainer details
                    // trainerMutation.mutate(data)       
                    // dispatch(removeResumeDetails())
                    // dispatch(resetTrainerDetails())
                    // queryClient.invalidateQueries(["getTrainerById", trainerId.id])
                }
            }
            // console.log(resume)
            
            const res = await api.put(`/trainersourcer/update-profile/${trainerId.id}`, {bankDetails: updateData})
            console.log(updateData)
            const data = res.data
            console.log(data)
            queryClient.invalidateQueries(["getTrainerById", trainerId.id])
            setIsEdit(false)
            toast({
                title:"Bank Details Updated",
                variant:"success"
            })
        } catch (e) {
            console.error(e)
            // setError('Failed to submit the resume')
        }

        

    }




    return (
        <div>
              <div className='flex justify-between'>
            <h2 className='text-slate-700  text-lg py-4 font-semibold'>Bank Details</h2>
            <div className='font-semibold text-lg'>
                    {/* Trainer {data.generalDetails?.name} */}
                    { !isEdit
                        ? (
                            <Button onClick={() => setIsEdit(true)} className="flex items-center">
                                <ion-icon name="pencil-outline"></ion-icon>
                                Edit
                            </Button>
                        )
                        :<Fragment>
                             <Button className="border bg-white text-red-500 mr-3 border-red-400" onClick={() => setIsEdit(false)}>
                                Cancel
                            </Button>
                             <Button onClick={submitHandler}>
                                Submit
                            </Button>
                        </Fragment>
}

                </div>
                </div>
            <div  className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-3 mt-3 place-items-center'>
            <div className='flex items-center'>
                    <Checkbox
                        name="sameasVendor"
                        checked={bankDetails.sameasVendor}
                        onCheckedChange={(checked) =>{
                            const updatedBankDetails = {...bankDetails, sameasVendor : checked}
                            setBankDetails(updatedBankDetails);
                            dispatch(setResumeDetails({
                            name:"bankDetails",
                            data:updatedBankDetails
                            }))
                        }
                        }
                    />

                    <Label htmlFor="pancard_Number" className="mx-3">Same as Vendor </Label>
                    {/* <Checkbox /> */}
                </div>
                <div>
                                <Label htmlFor="vendorName">Vendor Name</Label>
                                <Input type="text" id="vendorName" name="vendorName" onChange={(e) => handleChange(e)} readOnly={ bankDetails.sameasVendor ? true :false}/>
                            </div>


            </div>
            
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-3 mt-3 place-items-center'>
                {/* Account name, number, bank name, branch, IFSC code, Pancard number, Aadhar  */}

                {/* If external vendor - GST , vendor name */}
                <div>
                    <Label htmlFor="account_Name">Bank Account Name</Label>
                    <Input readOnly={!isEdit} type="text" id="account_Name" value={bankDetails.sameasVendor ? bankDetails.accountName : bankDetails.vendorName } name="accountName" onChange={(e) => handleChange(e)}/>
                </div>

                <div>
                    <Label htmlFor="account_Number">Account Number</Label>
                    <Input readOnly={!isEdit} type="number" value={bankDetails?.accountNumber} min={1} id="account_Number" name="accountNumber" onChange={(e) => handleChange(e)}/>
                </div>

                <div>
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input readOnly={!isEdit} type="text" value={bankDetails?.bankName} id="bankName" name="bankName" onChange={(e) => handleChange(e)}/>
                </div>

                <div>
                    <Label htmlFor="bank_Branch">Bank Branch</Label>
                    <Input readOnly={!isEdit} type="text" id="bank_Branch" value={bankDetails?.bankBranch} name="bankBranch" onChange={(e) => handleChange(e)}/>
                </div>

                <div>
                    <Label htmlFor="bank_IFSC_code">Bank IFSC Code</Label>
                    <Input readOnly={!isEdit} type="text" id="bank_IFSC_code" value={bankDetails?.bankIFSCCode} name="bankIFSCCode" onChange={(e) => handleChange(e)}/>
                </div>

                <div>
                    <Label htmlFor="pancard_Number">PAN Card Number</Label>
                    <Input readOnly={!isEdit} type="text" id="pancard_Number" value={bankDetails?.pancardNumber} name="pancardNumber" onChange={(e) => handleChange(e)}/>
                </div>

                <div>
                    <Label htmlFor="pancard_Number">Aadhar Card Number</Label>
                    <Input readOnly={!isEdit} type="text" id="aadharcard_Number" value={bankDetails?.aadharCardNumber} name="aadharCardNumber" onChange={(e) => handleChange(e)}/>
                </div>

                <div className=''>
                    <Label className="font-semibold" htmlFor="Aadhar Cards">Address Proof/ID </Label>
                    {
                        bankDetails.aadharCard  ? <a target='_blank' href={bankDetails.aadharCard} className='py-2 text-sm bg-blue-900 text-white ml-2 border rounded-none px-4'>Download</a> : <p className='ml-2'>
                            <Input
                            ref={AadharCardRef}
                            id="resume"
                            type="file"
                            onChange={(e) => handleFileChange(e, "aadharcard")}
                            accept=".pdf,.docx,.xlsx"/>
                        </p>
                    }
                </div>


                <div className=''>
                    <Label className="font-semibold" htmlFor="pan Cards">Pan Card</Label> 
                    {bankDetails.panCard ?<a target='_blank' href={bankDetails.panCard} className='py-2 text-sm bg-blue-900 text-white ml-2 border rounded-none px-4'>Download</a> : <p className='ml-2'>
                    <Input
                            ref={PanCardRef}
                            id="resume"
                            type="file"
                            onChange={(e) => handleFileChange(e, "pancard")}
                            accept=".pdf,.docx,.xlsx"/>

                            </p>}
                </div>

{/* 
                {
                    trainerDetails?.trainingDetails?.trainerType === "External - Vendor" ? 
                    (
                        <Fragment> */}
                            <div>
                                <Label htmlFor="vendorName">Vendor Name</Label>
                                <Input readOnly={!isEdit} type="text" id="vendorName" name="vendorName" onChange={(e) => handleChange(e)}/>
                            </div>
                            <div>
                                <Label htmlFor="gstNumber">GST Number</Label>
                                <Input readOnly={!isEdit} type="text" id="gstNumber" name="gstNumber" onChange={(e) => handleChange(e)}/>
                            </div>
                        {/* </Fragment>
                    ) : null
                } */}

            </div>

            {/* <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-3 mt-3 place-items-center'>
                    <div>
                        <Label htmlFor="account_Name">Address Proof/ ID</Label>
                        <Input
                            ref={AadharCardRef}
                            id="resume"
                            type="file"
                            onChange={(e) => handleFileChange(e, "aadharcard")}
                            accept=".pdf,.docx,.xlsx"/>
                    </div>

                    <div>
                        <Label htmlFor="account_Name">Pan Card</Label>
                        <Input
                            ref={PanCardRef}
                            id="resume"
                            type="file"
                            onChange={(e) => handleFileChange(e, "pancard")}
                            accept=".pdf,.docx,.xlsx"/>
                    </div>

                

            </div> */}
        </div>
    )
}


export default BankDetails