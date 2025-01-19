import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { setResumeDetails } from '@/features/trainerSlice';
import { useToast } from '@/hooks/use-toast';
import React, { useEffect, useState } from 'react'
import { useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

function BankDetails({data}){
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
            pancard:"",
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

    const submitHandler = async(e) => {
        // e.preventDefault()
        console.log("object")
        // http://bas.rjpinfotek.com:5000/api/trainer/updateResume/671f1f348706010ba634eb92/resum
        // e/671f1f348706010ba634eb8f
        // console.log(`http://bas.rjpinfotek.com:5000/api/trainer/updateResume/671f1f348706010ba
        // 6 34eb92/resume/${data._id}`)
        try {
            console.log("object ", trainerDetails)
            // console.log(resume)
            const res = await api.put(`/trainersourcer/update-profile/${trainerId.id}`, {bankDetails: bankDetails})
            console.log(bankDetails)
            const data = res.data
            console.log(data)
            queryClient.invalidateQueries(["getTrainerById", trainerId.id])
            setIsEdit(false)
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
                        : <Button onClick={submitHandler}>
                            Submit
                        </Button>
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

                    <Label htmlFor="pancard_Number" className="mx-3">Same as Vendor</Label>
                    {/* <Checkbox /> */}
                </div>
                <div>
                                <Label htmlFor="vendorName">Vendor Name</Label>
                                <Input type="text" id="vendorName" name="vendorName" onChange={(e) => handleChange(e)}/>
                            </div>  
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-3 mt-3 place-items-center'>
                {/* Account name, number, bank name, branch, IFSC code, Pancard number, Aadhar  */}

                {/* If external vendor - GST , vendor name */}
                <div>
                    <Label htmlFor="account_Name">Account Name</Label>
                    <Input type="text" id="account_Name" name="accountName" onChange={(e) => handleChange(e)}/>
                </div>

                <div>
                    <Label htmlFor="account_Number">Account Number</Label>
                    <Input type="number" min={1} id="account_Number" name="accountNumber" onChange={(e) => handleChange(e)}/>
                </div>

                <div>
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input type="text" id="bankName" name="bankName" onChange={(e) => handleChange(e)}/>
                </div>

                <div>
                    <Label htmlFor="bank_Branch">Bank Branch</Label>
                    <Input type="text" id="bank_Branch" name="bankBranch" onChange={(e) => handleChange(e)}/>
                </div>

                <div>
                    <Label htmlFor="bank_IFSC_code">Bank IFSC Code</Label>
                    <Input type="text" id="bank_IFSC_code" name="bankIFSCCode" onChange={(e) => handleChange(e)}/>
                </div>

                <div>
                    <Label htmlFor="pancard_Number">PAN Card Number</Label>
                    <Input type="text" id="pancard_Number" name="pancardNumber" onChange={(e) => handleChange(e)}/>
                </div>

                <div>
                    <Label htmlFor="pancard_Number">Aadhar Card Number</Label>
                    <Input type="text" id="aadharcard_Number" name="aadharCardNumber" onChange={(e) => handleChange(e)}/>
                </div>

{/* 
                {
                    trainerDetails?.trainingDetails?.trainerType === "External - Vendor" ? 
                    (
                        <Fragment> */}
                            <div>
                                <Label htmlFor="vendorName">Vendor Name</Label>
                                <Input type="text" id="vendorName" name="vendorName" onChange={(e) => handleChange(e)}/>
                            </div>
                            <div>
                                <Label htmlFor="gstNumber">GST Number</Label>
                                <Input type="text" id="gstNumber" name="gstNumber" onChange={(e) => handleChange(e)}/>
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