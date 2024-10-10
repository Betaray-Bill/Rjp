import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { height } from '@mui/system';
import axios from 'axios';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '  70vw',
  height:'70vh',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  overflowY: 'scroll',
  boxShadow: 24,
  p: 4,
};
 
function Account() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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


    // Edit Handle
    // const [formData, setFormData] = useState(trainerData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [formData, setFormData] = useState(user);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleArrayChange = (e, section) => {
    const { value, name } = e.target;
    const updatedArray = [...formData[section]];
    console.log(e, section)
    updatedArray[name] = value;
    setFormData((prevData) => ({
      ...prevData,
      [section]: updatedArray,
    }));
  };

    axios.defaults.withCredentials = true;
    const handleSubmit = async(e) => {
      e.preventDefault();
      // console.log('Form Data Submitted:', formData);
      // // Perform API call to save form data
      // try {
      //     const response = await axios.post('http://localhost:5000/api/trainersourcer/register-trainer', formData); // Replace with your API endpoint
      //     console.log('Registration successful:', response.data);
      //     // setUser(response.data)
      // }catch (error) {
      //     console.error('Registration failed:', error);
      // }
    };
    


  return (
    <div>
        <div className="container">
        <div style={{display:"flex", justifyContent:"space-between"}}>
          <h1>Trainer Profile</h1>
          {/* <span> */}
            <button onClick={handleOpen}>Edit</button>
          {/* </span> */}
        </div>

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
            <p>{date.title}</p>
            <div className="key-value">
              <strong>Start Date:</strong> {date.start ? convertDate(date.start) : 'N/A'}
            </div>
            <div className="key-value">
              <strong>End Date:</strong> {date.end ? convertDate(date.end) : 'N/A'}
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





        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
            Edit Profile
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <form onSubmit={handleSubmit} className="trainer-form">
                <h1>Edit Trainer Details</h1>

                <div className="form-group">
                  <label>Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    // readOnly
                  />
                </div>

                <div className="form-group">
                  <label>Type of Trainer:</label>
                  <input
                    type="text"
                    name="type_of_trainer"
                    value={formData.type_of_trainer}
                    onChange={handleInputChange}
                    // readOnly
                  />
                </div>

                {/* Professional Summary */}
                <div className="form-group">
                  <label>Professional Summary:</label>
                  {formData.resume_details.professionalSummary.map((summary, idx) => (
                    <input
                      key={idx}
                      type="text"
                      name={idx}
                      value={summary}
                      onChange={(e) => handleArrayChange(e, 'resume_details.professionalSummary')}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prevData) => ({
                        ...prevData,
                        resume_details: {
                          ...prevData.resume_details,
                          professionalSummary: [...prevData.resume_details.professionalSummary, ''],
                        },
                      }))
                    }
                  >
                    Add Summary
                  </button>
                </div>

                {/* Education */}
                <div className="form-group">
                  <label>Education:</label>
                  {formData.resume_details.education.map((edu, idx) => (
                    <input
                      key={idx}
                      type="text"
                      name={idx}
                      value={edu}
                      onChange={(e) => handleArrayChange(e, 'resume_details.education')}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prevData) => ({
                        ...prevData,
                        resume_details: {
                          ...prevData.resume_details,
                          education: [...prevData.resume_details.education, ''],
                        },
                      }))
                    }
                  >
                    Add Education
                  </button>
                </div>

                {/* Clientele */}
                <div className="form-group">
                  <label>Clientele:</label>
                  {formData.resume_details.clientele.map((client, idx) => (
                    <input
                      key={idx}
                      type="text"
                      name={idx}
                      value={formData.resume_details.clientele[idx]}
                      onChange={(e) => handleArrayChange(e, 'resume_details.clientele')}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prevData) => ({
                        ...prevData,
                        resume_details: {
                          ...prevData.resume_details,
                          clientele: [...prevData.resume_details.clientele, ''],
                        },
                      }))
                    }
                  >
                    Add Client
                  </button>
                </div>

                {/* Other sections such as contact details, certifications, etc. */}
                <div className="form-group">
                  <label>Contact Details:</label>
                  <input
                    type="text"
                    name="contact_Details.mobile_number"
                    value={formData.contact_Details.mobile_number}
                    onChange={handleInputChange}
                  />
                </div>

                <button type="submit">Update</button>
            </form>

            </Typography>
          </Box>
        </Modal>
    </div>
  )
}

export default Account
