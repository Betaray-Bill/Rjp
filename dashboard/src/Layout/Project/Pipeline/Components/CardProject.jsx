import React, { useEffect, useState } from "react";

function CardProjects({ projects, stage }) {
  console.log(projects);
  const [date, setDate] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // Filter remainders based on the stage
    const remainderStageData =
      projects &&
      projects.remainders?.filter((item) => {
        return item.stages === stage;
      });

    console.log(projects.remainders);
    console.log(remainderStageData);

    if (remainderStageData?.length > 0) {
      const nextRemainder = remainderStageData[0];
      setDate(new Date(nextRemainder.date).toISOString().split("T")[0]);
      setIsCompleted(nextRemainder.isCompleted);
    } else {
      setDate("");
      setIsCompleted(false);
    }
  }, [stage, projects]);

  const shouldShowRemainder = () => {
    if (!date) return false; // No date to compare

    const todayDate = new Date().toISOString().split("T")[0]; // Get today's date

    if (!isCompleted && todayDate > date) {
      // Date has passed and the remainder is not completed
      return true;
    }

    if (!isCompleted && todayDate <= date) {
      // Date is yet to come and the remainder is not completed
      return true;
    }

    return false; // Either completed or no conditions match
  };

  return (
    <div className="border border-gray-200 w-[350px] rounded-sm p-4 py-3 my-5 cursor-pointer bg-white relative">
      {/* Display remainder details if needed */}
      {shouldShowRemainder() && (
        <div className="bg-red-600 rounded-lg absolute top-0 -m-3 text-sm px-2 py-0.5 text-teal-50 drop-shadow-lg right-1">
          {date && date.split("-").reverse().join("-")}
        </div>
      )}

      <div className="flex items-start justify-between mt-3">
        <h4 className="font-semibold text-sm">{projects.projectName}</h4>
        <div className="grid place-content-end">
          <span className="rounded-md px-2 bg-blue-100 text-sm">
            {projects.company?.name}
          </span>
        </div>
      </div>
      <div className="flex justify-start mt-4 flex-wrap">
        <span className="font-light text-gray-800 text-sm">Training:</span>
        <span className="font-semibold ml-1 text-sm">{projects.domain}</span>
      </div>
      <div className="flex items-start justify-start mt-2">
        <span className="font-light text-sm">Owner:</span>
        <span className="font-medium ml-2 text-sm">{projects.projectOwner?.name}</span>
      </div>
      <div className="flex items-center justify-start mt-2">
        <ion-icon
          name="calendar-outline"
          style={{
            fontSize: "18px",
          }}
        ></ion-icon>
        <div className="ml-3 flex items-center justify-between font-light">
          <span className="text-sm">
            {new Date(projects.trainingDates?.startDate)
              .toISOString()
              .split("T")[0]}
          </span>
          <span className="mx-3">-</span>
          <span className="text-sm">
            {new Date(projects.trainingDates?.endDate)
              .toISOString()
              .split("T")[0]}
          </span>
        </div>
      </div>
    </div>
  );
}

export default CardProjects;
