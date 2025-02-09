import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { trainingModesEnum, trainingTypes } from "@/utils/constants";
import { useDispatch } from "react-redux";
import { setResumeDetails } from "@/features/trainerSlice";

function TrainingDetails() {
  const dispatch = useDispatch();

  const [trainingDetails, setTrainingDetails] = useState({
    trainerType: "",
    modeOfTraining: [], // Now an array to store multiple selected values
  });

  const handleTrainerTypeChange = (event) => {
    const updatedTrainingDetails = {
      ...trainingDetails,
      trainerType: event.target.value,
      modeOfTraining: [], // Reset modeOfTraining when trainerType changes
    };
    setTrainingDetails(updatedTrainingDetails);
    dispatch(setResumeDetails({ name: "trainingDetails", data: updatedTrainingDetails }));
  };

  // const handleModeOfTrainingChange = (event) => {
  //   const value = event.target.value;
  //   const updatedModeOfTraining = event.target.checked
  //     ? [...trainingDetails.modeOfTraining, value] // Add the selected value
  //     : trainingDetails.modeOfTraining.filter((mode) => mode !== value); // Remove the unselected value

  //   const updatedTrainingDetails = {
  //     ...trainingDetails,
  //     modeOfTraining: updatedModeOfTraining,
  //   };

  //   setTrainingDetails(updatedTrainingDetails);
  //   dispatch(setResumeDetails({ name: "trainingDetails", data: updatedTrainingDetails }));
  // };

  const handleModeOfTrainingChange = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;
  
    let updatedModeOfTraining;
  
    if (value === "All") {
      // If "All" is checked, select all options
      updatedModeOfTraining = isChecked ? [...trainingModesEnum] : [];
    } else {
      // If any other option is checked/unchecked
      updatedModeOfTraining = isChecked
        ? [...trainingDetails.modeOfTraining, value]
        : trainingDetails.modeOfTraining.filter((mode) => mode !== value);
  
      // If any individual checkbox is unchecked, remove "All"
      if (trainingDetails.modeOfTraining.includes("All")) {
        updatedModeOfTraining = updatedModeOfTraining.filter((mode) => mode !== "All");
      }
  
      // If all checkboxes except "All" are selected, automatically select "All"
      const otherModes = trainingModesEnum.filter((mode) => mode !== "All");
      if (
        updatedModeOfTraining.length === otherModes.length &&
        !updatedModeOfTraining.includes("All")
      ) {
        updatedModeOfTraining = [...updatedModeOfTraining, "All"];
      }
    }
  
    const updatedTrainingDetails = {
      ...trainingDetails,
      modeOfTraining: updatedModeOfTraining,
    };
  
    setTrainingDetails(updatedTrainingDetails);
    dispatch(setResumeDetails({ name: "trainingDetails", data: updatedTrainingDetails }));
  };
  

  return (
    <div className="ml-5">
      <h2 className="text-slate-700 text-lg py-4 font-semibold">Training Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-3 mt-3">
        {/* Training courses, institution, duration, mode of training */}
        <div className="flex flex-col">
          <Label htmlFor="trainerType" className="mb-2">
            Type of Trainer <span className='text-red-600'>*</span>
          </Label>
          <select
            name="trainerType"
            id="trainerType"
            onChange={handleTrainerTypeChange}
            value={trainingDetails.trainerType}
            className="w-[300px]"
          >
            <option value="">Select the Type</option>
            {trainingTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {trainingDetails.trainerType !== "" && trainingDetails.trainerType !== "Internal" && (
          <div className="flex flex-col">
            <Label htmlFor="modeOfTraining" className="mb-2">
              Mode of Training
            </Label>
            <div id="modeOfTraining" className="flex flex-wrap gap-5">
              {trainingModesEnum.map((mode, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`modeOfTraining-${index}`}
                    value={mode}
  checked={
    trainingDetails.modeOfTraining.includes("All")
      ? mode === "All" || trainingDetails.modeOfTraining.includes(mode)
      : trainingDetails.modeOfTraining.includes(mode)
  }
  onChange={handleModeOfTrainingChange} 
                    className="cursor-pointer p-2"
                  />
                  <label
                    htmlFor={`modeOfTraining-${index}`}
                    className="cursor-pointer text-slate-900"
                  >
                    {mode}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TrainingDetails;
