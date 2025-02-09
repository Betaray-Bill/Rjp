import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea';
import { setResumeDetails } from '@/features/trainerSlice';
import React, { Fragment, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

function BankDetails() {

    const dispatch = useDispatch();
    const {trainerDetails} = useSelector(state => state.trainer)
        const AadharCardRef = useRef()    
        const PanCardRef = useRef()    
        const [pan, setPan] = useState()
        const [aadharCard, setAadharCard] = useState()


    const [bankDetails, setBankDetails] = useState({
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
        sameasVendor:true,
        remarks:""
    })


    const handleChange = (event) => {
        const updatedBankDetails = {...bankDetails, [event.target.name] : event.target.value}
        setBankDetails(updatedBankDetails);
        dispatch(setResumeDetails({
          name:"bankDetails",
          data:updatedBankDetails
        }))
    }


    const handleFileChange = async(event, name) => {
        const file = event.target.files[0];
        console.log("INSIDE the file: " + file)
        if(name === "pancard"){
            setPan(file)
            const updatedBankDetails = {...bankDetails, pancard : file}
            setBankDetails(updatedBankDetails);
            dispatch(setResumeDetails({
              name:"bankDetails",
              data:updatedBankDetails
            }))
        }else{
            setAadharCard(file)
            const updatedBankDetails = {...bankDetails, aadharCard : file}
            setBankDetails(updatedBankDetails);
            dispatch(setResumeDetails({
              name:"bankDetails",
              data:updatedBankDetails
            }))
        }
    };

    console.log(trainerDetails)
    return (
        <div>
            <h2 className='text-slate-700  text-lg py-4 font-semibold'>Bank Details / Invoice Details</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-3 mt-3 place-items-center'>
                {/* Account name, number, bank name, branch, IFSC code, Pancard number, Aadhar  */}

                {/* If external vendor - GST , vendor name */}
                
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

                    <Label htmlFor="pancard_Number" className="mx-3">Same as Vendor<span className='text-red-600'>*</span></Label> 
                </div>
                            <div>
                                <Label htmlFor="vendorName">Vendor Name</Label>
                                <Input type="text" id="vendorName" name="vendorName" onChange={(e) => handleChange(e)} readOnly={bankDetails.sameasVendor ? true :false}/>
                            </div>
                <div>
                    <Label htmlFor="account_Name">Bank Account Name</Label>
                    <Input type="text" id="account_Name" value={bankDetails.sameasVendor ? bankDetails.accountName : bankDetails.vendorName } name="accountName" onChange={(e) => handleChange(e)}/>
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
                            <div>
                                <Label htmlFor="gstNumber">GST Number</Label>
                                <Input type="text" id="gstNumber" name="gstNumber" onChange={(e) => handleChange(e)}/>
                            </div>

                            <div>
                                <Label htmlFor="remarks">Remarks</Label>
                                <Textarea type="text" id="remarks" name="remarks" className="w-[300px]  h-[50px] " onChange={(e) => handleChange(e)}/>
                            </div>


            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-3 mt-3 place-items-center'>
                    <div>
                        <Label htmlFor="account_Name">Address Proof/ ID</Label>
                        {/* <Input type="text" id="account_Card" name="accountName" onChange={(e) => handleChange(e)}/> */}
                        <Input
                            ref={AadharCardRef}
                            id="resume"
                            type="file"
                            onChange={(e) => handleFileChange(e, "aadharcard")}
                            accept=".pdf,.docx,.xlsx"/>
                    </div>

                    <div>
                        <Label htmlFor="account_Name">Pan Card</Label>
                        {/* <Input type="text" id="account_Card" name="accountName" onChange={(e) => handleChange(e)}/> */}
                        <Input
                            ref={PanCardRef}
                            id="resume"
                            type="file"
                            onChange={(e) => handleFileChange(e, "pancard")}
                            accept=".pdf,.docx,.xlsx"/>
                    </div>

                

            </div>
        </div>
    )
}

export default BankDetails
