import React from 'react'
import { useSelector } from 'react-redux'

function Account() {
    const {user}  = useSelector(state => state.auth)
    const renderArray = (arr) => {
        return arr.map((item, index) => item && <li key={index}>{item}</li>);
      };
    
      const renderObject = (obj) => {
        return Object.keys(obj).map((key) => (
          <div key={key}>
            <strong>{key.replace(/_/g, ' ')}:</strong> {obj[key]}
          </div>
        ));
      };

    function convertDate(dateStr) {
        // Check if dateStr is a string, and then convert it to a Date object
        const date = new Date(dateStr);
      
        // Verify that 'date' is a valid Date object
        if (isNaN(date.getTime())) {
          throw new Error('Invalid Date');
        }
      
        // Extract day, month, and year from the Date object
        const day = date.getUTCDate(); // For local time, use date.getDate()
        const month = date.getUTCMonth() + 1; // Months are zero-indexed, so add 1
        const year = date.getUTCFullYear(); // For local time, use date.getFullYear()
      
        // Format the date as DD/MM/YYYY
        const formattedDate = `${day}/${month}/${year}`;
      
        return formattedDate;
    }


  return (
    <div>
        <div className="container">
      <h1>Trainer Profile</h1>

      <div className="section">
        <h2>Personal Details</h2>
        <div className="key-value">
          <strong>Name:</strong> {user.name}
        </div>
        <div className="key-value">
          <strong>Type of Trainer:</strong> {user.type_of_trainer}
        </div>
        <div className="key-value">
          <strong>Trainer ID:</strong> {user.trainerId}
        </div>
        <div className="key-value">
          <strong>Is First Login:</strong> {user.is_FirstLogin ? 'Yes' : 'No'}
        </div>
        <div className="key-value">
          <strong>NDA Accepted:</strong> {user.nda_Accepted ? 'Yes' : 'No'}
        </div>
      </div>

      <div className="section">
        <h2>Bank Details</h2>
        {renderObject(user.bank_Details)}
      </div>

      <div className="section">
        <h2>Contact Details</h2>
        {renderObject(user.contact_Details)}
      </div>

      <div className="section">
        <h2>Resume Details</h2>
        {Object.keys(user.resume_details).map((key) => (
          <div key={key}>
            <h3>{key.replace(/_/g, ' ')}</h3>
            <ul>{renderArray(user.resume_details[key])}</ul>
          </div>
        ))}
      </div>

      <div className="section">
        <h2>Available Dates</h2>
        {user.availableDate.map((date, index) => (
          <div key={index} className='section' style={{width:"400px"}}>
            <div className="key-value">
              <strong>Start Date:</strong> {date.startDate ? convertDate(date.startDate) : 'N/A'}
            </div>
            <div className="key-value">
              <strong>End Date:</strong> {date.endDate ? convertDate(date.endDate) : 'N/A'}
            </div>
          </div>
        ))}
      </div>

      <div className="section">
        <h2>Other Information</h2>
        <div className="key-value">
          <strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}
        </div>
        <div className="key-value">
          <strong>Updated At:</strong> {new Date(user.updatedAt).toLocaleString()}
        </div>
      </div>
    </div>
    </div>
  )
}

export default Account
