import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { setResumeDetails } from '@/features/trainerSlice';
import { useToast } from '@/hooks/use-toast';
import api from '@/utils/api';
import React, { useState, useRef } from 'react';
import { useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';

function BankDetails() {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const [isEdit, setIsEdit] = useState(false);

    const [bankDetails, setBankDetails] = useState({
        ...user.bankDetails
    });

    const AadharCardRef = useRef();
    const PanCardRef = useRef();

    const [pan, setPan] = useState();
    const [aadharCard, setAadharCard] = useState();

    const handleFileChange = async (event, name) => {
        const file = event.target.files[0];
        if (name === "pancard") {
            setPan(file);
            const updatedBankDetails = {
                ...bankDetails,
                pancard: file
            };
            setBankDetails(updatedBankDetails);
            dispatch(setResumeDetails({ name: "bankDetails", data: updatedBankDetails }));
        } else {
            setAadharCard(file);
            const updatedBankDetails = {
                ...bankDetails,
                aadharCard: file
            };
            setBankDetails(updatedBankDetails);
            dispatch(setResumeDetails({ name: "bankDetails", data: updatedBankDetails }));
        }
    };

    const submitFiles = async () => {
        const formData = new FormData();

        // Check if new files are uploaded and append them
        if (typeof bankDetails.pancard !== "string" && bankDetails.pancard) {
            formData.append("pancard", bankDetails.pancard);
        }

        if (typeof bankDetails.aadharCard !== "string" && bankDetails.aadharCard) {
            formData.append("aadharCard", bankDetails.aadharCard);
        }

        if (formData.has("pancard") || formData.has("aadharCard")) {
            try {
                const uploadResult = await api.post(
                    `/filestorage/upload-aadhar-pan/trainer/${user._id}`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    }
                );

                const uploadedFiles = uploadResult.data;

                // Merge new file URLs into bankDetails
                const updatedBankDetails = {
                    ...bankDetails,
                    panCard: uploadedFiles.pancard || bankDetails.pancard,
                    aadharCard: uploadedFiles.aadharCard || bankDetails.aadharCard
                };

                // Save the updated bank details in the backend
                const res = await api.put(`/trainer/update/${user._id}`, {
                    bankDetails: updatedBankDetails
                });

                queryClient.invalidateQueries(["user", user._id]);
                toast({
                    title: "Files Uploaded Successfully",
                    description: "Your files have been successfully uploaded.",
                    variant: "success",
                    duration: 3000
                });
                setIsEdit(false);
            } catch (error) {
                toast({
                    title: "File Upload Failed",
                    description: "There was an error uploading your files.",
                    variant: "destructive",
                    duration: 3000
                });
            }
        } else {
            toast({
                title: "No New Files",
                description: "No new files to upload.",
                variant: "destructive",
                duration: 3000
            });
        }
    };

    return (
        <div className="w-[90vw] lg:w-[80vw] mt-8 p-6 bg-white rounded-md">
            <div className="flex items-center justify-between">
                <h2 className="text-slate-700 text-lg py-4 font-semibold">Bank Details</h2>
                {isEdit ? (
                    <Button className="rounded-none" onClick={submitFiles}>
                        Submit
                    </Button>
                ) : (
                    <Button className="rounded-none" onClick={() => setIsEdit(true)}>
                        Edit
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 mg:grid-cols-2 gap-5 border rounded-md mt-7 p-4">
                <div>
                    <Label htmlFor="aadharCard">Address Proof</Label>
                    { bankDetails.aadharCard && bankDetails.aadharCard  !== "" ? (
                        <a
                            href={user.bankDetails.aadharCard}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 text-white bg-blue-600 block w-max"
                        >
                            Download Address Proof
                        </a>
                    ) : (
                        <Input
                            ref={AadharCardRef}
                            id="aadharCard"
                            className="w-max"
                            disabled={!isEdit}
                            type="file"
                            onChange={(e) => handleFileChange(e, "aadharCard")}
                            accept=".pdf,.docx,.xlsx"
                        />
                    )}
                </div>

                <div>
                    <Label htmlFor="panCard">PAN Card</Label>
                    { bankDetails.panCard && bankDetails.panCard !== "" ? (
                        <a
                            href={user.bankDetails.panCard}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 text-white bg-blue-600 block w-max"
                        >
                            Download PAN Card
                        </a>
                    ) : (
                        <Input
                            ref={PanCardRef}
                            id="panCard"
                            className="w-max"
                            type="file"
                            onChange={(e) => handleFileChange(e, "pancard")}
                            disabled={!isEdit}
                            accept=".pdf,.docx,.xlsx"
                        />
                    )}
                </div>

                {isEdit && (
                    <div>
                        <Button onClick={submitFiles}>Upload Files</Button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default BankDetails;
