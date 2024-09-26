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
          <div key={index}>
            <div className="key-value">
              <strong>Start Date:</strong> {date.startDate ? date.startDate : 'N/A'}
            </div>
            <div className="key-value">
              <strong>End Date:</strong> {date.endDate ? date.endDate : 'N/A'}
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
