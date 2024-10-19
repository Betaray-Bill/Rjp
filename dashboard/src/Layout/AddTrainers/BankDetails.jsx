import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { setResumeDetails } from '@/features/trainerSlice';
import React, { Fragment, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

function BankDetails() {

    const dispatch = useDispatch();
    const {trainerDetails} = useSelector(state => state.trainer)
    

    const [bankDetails, setBankDetails] = useState({
        accountName: "",
        accountNumber: Number(),
        bankName: "",
        bankBranch: "",
        bankIFSCCode: "",
        pancardNumber: "",
        aadharCardNumber: "",
        gstNumber: "",
        vendorName: "",
    })


    const handleChange = (event) => {
        const updatedBankDetails = {...bankDetails, [event.target.name] : event.target.value}
        setBankDetails(updatedBankDetails);
        dispatch(setResumeDetails({
          name:"bankDetails",
          data:updatedBankDetails
        }))
    }

    console.log(trainerDetails.trainingDetails)
    return (
        <div>
            <h2 className='text-slate-700  text-lg py-4 font-semibold'>Bank Details</h2>
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

                {
                    trainerDetails?.trainingDetails?.trainerType === "External - Vendor" ? 
                    (
                        <Fragment>
                            <div>
                                <Label htmlFor="vendorName">Vendor Name</Label>
                                <Input type="text" id="vendorName" name="vendorName" onChange={(e) => handleChange(e)}/>
                            </div>
                            <div>
                                <Label htmlFor="gstNumber">GST Number</Label>
                                <Input type="text" id="gstNumber" name="gstNumber" onChange={(e) => handleChange(e)}/>
                            </div>
                        </Fragment>
                    ) : null
                }

            </div>
        </div>
    )
}

export default BankDetails
