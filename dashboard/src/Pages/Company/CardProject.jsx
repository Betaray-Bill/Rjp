import React from 'react'

function CardProject({ project }) {
    const {
        company,
        contactDetails,
        trainingDates,
        projectName,
        domain,
        description,
        employees,
        modeOfTraining,
      } = project;
  return (
    <div className="max-w-2xl mx-auto my-8 p-6 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">{projectName}</h1>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-700">Company Details</h2>
        <p className="text-gray-600"><span className="font-medium">Company Name:</span> {company.name}</p>
        <p className="text-gray-600"><span className="font-medium">Company ID:</span> {company.Company_id}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-700">Contact Information</h2>
        <p className="text-gray-600"><span className="font-medium">Contact Person:</span> {contactDetails.name}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-700">Training Schedule</h2>
        <p className="text-gray-600">
          <span className="font-medium">Start Date:</span> {new Date(trainingDates.startDate).toLocaleDateString()}
        </p>
        <p className="text-gray-600">
          <span className="font-medium">End Date:</span> {new Date(trainingDates.endDate).toLocaleDateString()}
        </p>
        <p className="text-gray-600">
          <span className="font-medium">Timing:</span> {trainingDates.timing || "Not specified"}
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-700">Project Details</h2>
        <p className="text-gray-600"><span className="font-medium">Domain:</span> {domain}</p>
        <p className="text-gray-600"><span className="font-medium">Mode of Training:</span> {modeOfTraining}</p>
        <p className="text-gray-600"><span className="font-medium">Description:</span> {description}</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-700">Employees Information</h2>
        {/* Add any additional information here */}
        {
            // Example of how to display employees information
            employees && employees?.map((employee, index) => (
              <div key={index} className="mb-4">
                <p className="text-gray-600"><span className="font-medium">Employee Name:</span> {employee.name}</p>
                <p className="text-gray-600"><span className="font-medium">Employee ID:</span> {employee.email}</p>
              </div>
            )) || <p className="text-gray-600">No employees found.</p>

          // Add more details as needed, such as project team, skills, etc.
        }
      </div>
    </div>
  )
}

export default CardProject
