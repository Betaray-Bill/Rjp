import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setResumeDetails } from "@/features/trainerSlice.js";

function PersonalDetails({ data }) {
  const dispatch = useDispatch();
  const { trainerDetails } = useSelector((state) => state.trainer);

  const [generalDetails, setGeneralDetails] = useState({
    name: "",
    email: "",
    phoneNumber: null,
    whatsappNumber: null,
    alternateNumber: null,
    dateOfBirth: Date(),
    address: {
      flat_doorNo_street: "",
      area: "",
      townOrCity: "",
      state: "",
      pincode: "",
    },
    sourcedFrom: "",
  });

  const [showOtherInput, setShowOtherInput] = useState(false);

  useEffect(() => {
    if (data) {
      setGeneralDetails(data);
    }
  }, [data]);

  const handleChange = (event) => {
    const updatedGeneralDetails = {
      ...generalDetails,
      [event.target.name]: event.target.value,
    };
    setGeneralDetails(updatedGeneralDetails);
    dispatch(setResumeDetails({ name: "generalDetails", data: updatedGeneralDetails }));
  };

  const handleAddressChange = (event) => {
    const updatedGeneralDetails = {
      ...generalDetails,
      address: {
        ...generalDetails.address,
        [event.target.name]: event.target.value,
      },
    };
    setGeneralDetails(updatedGeneralDetails);
    dispatch(setResumeDetails({ name: "generalDetails", data: updatedGeneralDetails }));
  };

  const handleSourcedFromChange = (event) => {
    const value = event.target.value;
    if (value === "Others") {
      setShowOtherInput(true);
      setGeneralDetails({ ...generalDetails, sourcedFrom: "" });
    // dispatch(setResumeDetails({ name: "generalDetails", data: updatedGeneralDetails }));

    } else {
      setShowOtherInput(false);
      setGeneralDetails({ ...generalDetails, sourcedFrom: value });
    }
    dispatch(setResumeDetails({ name: "generalDetails", data: generalDetails }));

  };

  return (
    <div className="">
      <h2 className="text-slate-700 text-lg py-4 font-semibold">General Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[25px] mb-3 mt-3 place-items-center">
        <div>
          <Label htmlFor="Name">Name <span className='text-red-600'>*</span></Label>
          <Input
            type="text"
            value={generalDetails.name}
            id="name"
            name="name"
            onChange={(e) => handleChange(e)}
          />
        </div>

        <div>
          <Label htmlFor="Email">Email <span className='text-red-600'>*</span></Label>
          <Input
            type="email"
            value={generalDetails.email}
            id="Email"
            name="email"
            onChange={(e) => handleChange(e)}
          />
        </div>

        <div>
          <Label htmlFor="Phone Number" className="flex items-center">
            <span className="mr-4">Phone Number <span className='text-red-600'>*</span></span>
            <ion-icon
              name="repeat-outline"
              style={{
                fontSize: "24px",
              }}
              onClick={() =>
                setGeneralDetails({
                  ...generalDetails,
                  whatsappNumber: generalDetails.phoneNumber,
                })
              }
            ></ion-icon>
          </Label>
          <Input
            type="number"
            id="Phone Number"
            value={generalDetails.phoneNumber || ""}
            name="phoneNumber"
            onChange={(e) => handleChange(e)}
          />
        </div>

        <div>
          <Label htmlFor="Whatsapp Number">
            <span>Whatsapp Number</span>
          </Label>
          <Input
            type="number"
            id="Whatsapp Number"
            value={
              generalDetails.whatsappNumber === null
                ? generalDetails.phoneNumber
                : generalDetails.whatsappNumber
            }
            name="whatsappNumber"
            onChange={(e) => handleChange(e)}
          />
        </div>

        <div>
          <Label htmlFor="Alternate Number">Alternate Number</Label>
          <Input
            type="number"
            id="Alternate Number"
            value={generalDetails.alternateNumber || ""}
            name="alternateNumber"
            onChange={(e) => handleChange(e)}
          />
        </div>

        <div className="flex flex-col">
          <Label htmlFor="Date of Birth" className="mb-2">
            Date of Birth
          </Label>
          <Input
            type="date"
            className="w-max"
            id="name"
            name="dateOfBirth"
            onChange={(e) => handleChange(e)}
            value={generalDetails.dateOfBirth}
          />
        </div>

        <div>
          <Label htmlFor="flat_doorNo_street">Flat/Door No/Street</Label>
          <Input
            type="text"
            id="flat_doorNo_street"
            name="flat_doorNo_street"
            onChange={(e) => handleAddressChange(e)}
          />
        </div>
        <div>
          <Label htmlFor="area">Area</Label>
          <Input
            type="text"
            id="area"
            name="area"
            onChange={(e) => handleAddressChange(e)}
          />
        </div>
        <div>
          <Label htmlFor="townOrCity">Town or City</Label>
          <Input
            type="text"
            id="townOrCity"
            name="townOrCity"
            onChange={(e) => handleAddressChange(e)}
          />
        </div>
        <div>
          <Label htmlFor="state">State</Label>
          <Input
            type="text"
            id="state"
            name="state"
            onChange={(e) => handleAddressChange(e)}
          />
        </div>
        <div>
          <Label htmlFor="pincode">Pincode</Label>
          <Input
            type="text"
            id="pincode"
            name="pincode"
            onChange={(e) => handleAddressChange(e)}
          />
        </div>

        <div>
          <Label htmlFor="sourcedFrom">Sourced From</Label>
          <select
            id="sourcedFrom"
            name="sourcedFrom"
            value={generalDetails.sourcedFrom}
            onChange={(e) => handleSourcedFromChange(e)}
            className="w-full border rounded-md p-2"
          >
            {/* {/ <span className='text-red-600'>*</span> <option value="">Select</option> */} 
            <option value="Telegram">Telegram</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Others">Others</option>
          </select>
        </div>
 
        {showOtherInput && (
          <div>
            <Label htmlFor="otherSourcedFrom">Specify Source</Label>
         
            <Input
              type="text"
              id="otherSourcedFrom"
              name="otherSourcedFrom"
              onChange={(e) =>
                setGeneralDetails({
                  ...generalDetails,
                  sourcedFrom: e.target.value,
                })
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default PersonalDetails;

