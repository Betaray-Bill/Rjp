import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {setResumeDetails} from '@/features/trainerSlice';
import {useToast} from '@/hooks/use-toast';
import axios from 'axios';
import React, {Fragment, useRef, useState} from 'react'
import {useQueryClient} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';

function BankDetails() {
    const queryClient = useQueryClient()
    const {toast} = useToast()
    const dispatch = useDispatch();
    const {user} = useSelector(state => state.auth)
    const [isEdit,
        setIsEdit] = useState(false);

    const [bankDetails,
        setBankDetails] = useState({
        ...user.bankDetails
    })
    console.log(bankDetails)
    const handleChange = (event) => {
        const updatedBankDetails = {
            ...bankDetails,
            [event.target.name]: event.target.value
        }
        setBankDetails(updatedBankDetails);
        dispatch(setResumeDetails({name: "bankDetails", data: updatedBankDetails}))
    }
    const AadharCardRef = useRef()
    const PanCardRef = useRef()
    const [pan,
        setPan] = useState()
    const [aadharCard,
        setAadharCard] = useState()

    const handleFileChange = async(event, name) => {
        const file = event.target.files[0];
        console.log("INSIDE the file: " + file)
        if (name === "pancard") {
            console.log("pancard")
            setPan(file)
            const updatedBankDetails = {
                ...bankDetails,
                pancard: file
            }
            console.log(updatedBankDetails)
            setBankDetails(updatedBankDetails);
            dispatch(setResumeDetails({name: "bankDetails", data: updatedBankDetails}))
        } else {
            setAadharCard(file)
            const updatedBankDetails = {
                ...bankDetails,
                aadharCard: file
            }
            setBankDetails(updatedBankDetails);
            dispatch(setResumeDetails({name: "bankDetails", data: updatedBankDetails}))
        }
    };

    axios.defaults.withCredentials = true;
    const handleSubmit = async(e) => {
        // console.log(bankDetails.pancard, bankDetails.aadharCard)
        // if (bankDetails.pancard === undefined && bankDetails.aadharCard  === undefined) {
            console.log(bankDetails)
            const res = await axios.put(`http://localhost:5000/api/trainer/update/${user._id}`, {
                bankDetails: {
                    ...bankDetails
                }
            })
            const response = await res.data;
            queryClient.invalidateQueries(["user", user._id])
            toast({title: "Training Domains Updated", description: "Your training domains have been successfully updated ", variant: " success ", duration: 3000})
            setIsEdit(false)
        
    };

    const submitFiles = async() => {
        console.log("Checking blob connection...");
        const result = await axios.get('http://localhost:5000/api/filestorage/check-blob-connection');
        const response = result.data;
        console.log("Connection check result:", response);

        if( bankDetails.aadharCard && bankDetails.pancard ){
            
        if (result.status == 200) {
            console.log("File is present. Sending data to another API...");

            // Call another POST API Create a FormData object to handle file upload
            const formData = new FormData();
            formData.append("aadharCard", bankDetails.aadharCard);
            formData.append("pancard", bankDetails.pancard);
            console.log(formData)
            // Additional metadata Call the POST API to upload the file
            const uploadResult = await axios.post(`http://localhost:5000/api/filestorage/upload-aadhar-pan/trainer/${user._id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            const res = uploadResult.data
            console.log(res)
            const data = { 
                    ...user.bankDetails,
                    panCard: res.pancard,
                    aadharCard: res.aadharCard
                
            }
            const resData = await axios.put(`http://localhost:5000/api/trainer/update/${user._id}`, {
                bankDetails: {
                    ...data
                }
            })
            const response = await resData.data;
            queryClient.invalidateQueries(["user", user._id])
            toast({title: "Training Domains Updated", description: "Your training domains have been successfully updated ", variant: " success ", duration: 3000})
            setIsEdit(false)

        }
        }else{
            toast({
                title: "Bank Details Update",
                description: "Please upload both Aadhar and Pancard documents",
                variant: "destructive",
                duration: 3000,
            })
        }

    }

    // console.log(trainerDetails.trainingDetails)
    return (
        <div className='w-[90vw] lg:w-[80vw]  mt-8 p-6 bg-white rounded-md'>
            {/* <h2 className='text-slate-700  text-lg py-4 font-semibold'>Bank Details</h2> */}
            <div className='flex items-center justify-between'>
                <h2 className='text-slate-700  text-lg py-4 font-semibold'>Bank Details</h2>
                {isEdit
                    ? <Button className="rounded-none" onClick={handleSubmit}>Submit</Button>
                    : <Button className="rounded-none" onClick={() => setIsEdit(true)}>Edit</Button>
}
            </div>
            <div
                className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-3 mt-3 place-items-center border p-4'>
                {/* Account name, number, bank name, branch, IFSC code, Pancard number, Aadhar  */}
                {/* <form className="space-y-4"> */}
                <div>
                    <Label htmlFor="account_Name">Account Name</Label>
                    <Input
                        type="text"
                        id="account_Name"
                        name="accountName"
                        value={bankDetails.accountName}
                        onChange={handleChange}/>
                </div>

                <div>
                    <Label htmlFor="account_Number">Account Number</Label>
                    <Input
                        type="number"
                        min={1}
                        id="account_Number"
                        name="accountNumber"
                        value={bankDetails.accountNumber}
                        onChange={handleChange}/>
                </div>

                <div>
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input
                        type="text"
                        id="bankName"
                        name="bankName"
                        value={bankDetails.bankName}
                        onChange={handleChange}/>
                </div>

                <div>
                    <Label htmlFor="bank_Branch">Bank Branch</Label>
                    <Input
                        type="text"
                        id="bank_Branch"
                        name="bankBranch"
                        value={bankDetails.bankBranch}
                        onChange={handleChange}/>
                </div>

                <div>
                    <Label htmlFor="bank_IFSC_code">Bank IFSC Code</Label>
                    <Input
                        type="text"
                        id="bank_IFSC_code"
                        name="bankIFSCCode"
                        value={bankDetails.bankIFSCCode}
                        onChange={handleChange}/>
                </div>

                <div>
                    <Label htmlFor="pancard_Number">PAN Card Number</Label>
                    <Input
                        type="text"
                        id="pancard_Number"
                        name="pancardNumber"
                        value={bankDetails.pancardNumber}
                        onChange={handleChange}/>
                </div>

                <div>
                    <Label htmlFor="aadharcard_Number">Aadhar Card Number</Label>
                    <Input
                        type="text"
                        id="aadharcard_Number"
                        name="aadharCardNumber"
                        value={bankDetails.aadharCardNumber}
                        onChange={handleChange}/>
                </div>

                <div>
                    <Label htmlFor="vendorName">Vendor Name</Label>
                    <Input
                        type="text"
                        id="vendorName"
                        name="vendorName"
                        value={bankDetails.vendorName}
                        onChange={handleChange}/>
                </div>
                <div>
                    <Label htmlFor="gstNumber">GST Number</Label>
                    <Input
                        type="text"
                        id="gstNumber"
                        name="gstNumber"
                        value={bankDetails.gstNumber}
                        onChange={handleChange}/>
                </div>

                
                {/* </form> */}
            </div>


            <div className='grid grid-cols-2 gap-5 border rounded-md mt-7 p-4'>
                <div>
                    <Label htmlFor="account_Name">Aadhar Card</Label>
                    {/* <Input type="text" id="account_Card" name="accountName" onChange={(e) => handleChange(e)}/> */}
                    {
                        user.bankDetails.aadharCard? 
                            <a href={bankDetails.aadharCard} className='px-3 py-2 text-white bg-blue-600 block w-max' target="_blank" rel="noopener noreferrer">View Aadhar Card</a>
                            : <Input
                            ref={AadharCardRef}
                            id="resume"
                            className="w-max"
                            type="file"
                            onChange={(e) => handleFileChange(e, "aadharCard")}
                            accept=".pdf,.docx,.xlsx"/>
                    }
                </div>

                <div>
                    <Label htmlFor="account_Name">Pan Card</Label>
                    {/* <Input type="text" id="account_Card" name="accountName" onChange={(e) => handleChange(e)}/> */}
                    {
                        user.bankDetails.panCard? 
                            <a href={bankDetails.panCard} className='px-3 py-2 text-white bg-blue-600 block w-max' target="_blank" rel="noopener noreferrer">View Pan Card</a>
                            : <Input
                            ref={PanCardRef}
                            id="resume"
                            className="w-max"
                            type="file"
                            onChange={(e) => handleFileChange(e, "pancard")}
                            accept=".pdf,.docx,.xlsx"/>
                    }
                    {/* <Input
                        ref={PanCardRef}
                        id="resume"
                        className="w-max"
                        type="file"
                        onChange={(e) => handleFileChange(e, "pancard")}
                        accept=".pdf,.docx,.xlsx"/> */}
                </div>

                <div>
                    <Button onClick={submitFiles}>Upload Files</Button>
                </div>
            </div>
        </div>
    )
}

export default BankDetails
