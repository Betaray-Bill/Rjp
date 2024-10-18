import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'

function BankDetails() {
    return (
        <div>
            <h2 className='text-slate-700  text-lg py-4 font-semibold'>Bank Details</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-3 mt-3 place-items-center'>
                {/* Account name, number, bank name, branch, IFSC code, Pancard number, Aadhar  */}

                {/* If external vendor - GST , vendor name */}
                <div>
                    <Label htmlFor="account_Name">Account Name</Label>
                    <Input type="text" id="account_Name" name="account_Name"/>
                </div>

                <div>
                    <Label htmlFor="account_Number">Account Number</Label>
                    <Input type="number" id="account_Number" name="account_Number"/>
                </div>

                <div>
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input type="text" id="bankName" name="bankName"/>
                </div>

                <div>
                    <Label htmlFor="bank_Branch">Bank Branch</Label>
                    <Input type="text" id="bank_Branch" name="bank_Branch"/>
                </div>

                <div>
                    <Label htmlFor="bank_IFSC_code">Bank IFSC Code</Label>
                    <Input type="text" id="bank_IFSC_code" name="bank_IFSC_code"/>
                </div>

                <div>
                    <Label htmlFor="pancard_Number">PAN Card Number</Label>
                    <Input type="text" id="pancard_Number" name="pancard_Number"/>
                </div>

                {
                    "External - Vendor" ? 
                    (
                        <div>

                        </div>
                    ) : null
                }

            </div>
        </div>
    )
}

export default BankDetails
