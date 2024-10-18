import React, { useState, useEffect, Fragment } from 'react';
// import './AddTrainer.css'; // External CSS file for grid styling
import { useSelector } from 'react-redux';
import PersonalDetails from '@/Layout/AddTrainers/PersonalDetails.jsx';
import ResumeDetails from '@/Layout/AddTrainers/Resume/ResumeDetails';
import BankDetails from '@/Layout/AddTrainers/BankDetails';
 
 let add = 0

const AddTrainer = () => {
  console.log("meow", add++)
 
    const {currentUser} = useSelector(state => state.auth)

  const [formData, setFormData] = useState({
    name: '',
    type_of_trainer: 'Internal', // Default to 'Internal'
    trainerId: '',
    password: '',
    is_FirstLogin: true,
    nda_Accepted: false,
    trainer_sourcer: currentUser && currentUser.employee._id,
    price:Number(0),
    price_type:'hourly',
    training_mode:'',
    training_type:'',
    rating:0,
    // Bank Details
    bank_Details: {
      account_Name: '',
      account_Number: '',
      bank_Branch: '',
      bank_IFSC_code: '',
      pancard_Number: '',
      aadharcard_number: '',
      gst_number:'',
      vendorName:''
    },

    // Contact Details
    contact_Details: {
      mobile_number: '',
      email_id: '',
      whatsapp_number:''
    },

    availableDate: [{ startDate: '', endDate: '' }],

    // Resume Details
    resume_details: {
      professionalSummary: [''],
      technicalSkills: [''],
      careerHistory: [''],
      certifications: [''],
      education: [''],
      trainingsDelivered: [''],
      clientele: [''],
      experience: [''],
      file_url: ''
    }
  });

  
  // useEffect(() => {
  //   const savedFormData = localStorage.getItem('trainerFormData');
  //   if (savedFormData) {
  //     setFormData(JSON.parse(savedFormData)); // Set saved form data
  //   }

  //   console.log(JSON.parse(savedFormData))
  // }, []);

 
  // useEffect(() => {
  //   localStorage.setItem('trainerFormData', JSON.stringify(formData));
  // }, [formData]);


  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   const path = name.split('.'); // To handle nested fields like 'bank_Details.account_Name'
  //   // console.log(formData)
  //   if (path.length === 1) {
  //     setFormData({ ...formData, [name]: value });
  //   } else {
  //     setFormData({
  //       ...formData,
  //       [path[0]]: {
  //         ...formData[path[0]],
  //         [path[1]]: value
  //       }
  //     });
  //   }
  // };
  // console.log(formData)
  
  // const handleArrayChange = (e, field, index) => {
  //   const updatedArray = [...formData.resume_details[field]];
  //   updatedArray[index] = e.target.value;
  //   setFormData({
  //     ...formData,
  //     resume_details: {
  //       ...formData.resume_details,
  //       [field]: updatedArray
  //     }
  //   });
  // };


  // const addArrayRow = (field) => {
  //   setFormData({
  //     ...formData,
  //     resume_details: {
  //       ...formData.resume_details,
  //       [field]: [...formData.resume_details[field], '']
  //     }
  //   });
  // };

  // // Handle form submission
  // axios.defaults.withCredentials = true;
  // const handleSubmit = async(e) => {
  //   e.preventDefault();
  //   console.log('Form Data Submitted:', formData);
  //   // Perform API call to save form data
  //   try {
  //       const response = await axios.post('http://localhost:5000/api/trainersourcer/register-trainer', formData); // Replace with your API endpoint
  //       console.log('Registration successful:', response.data);
  //       // setUser(response.data)
  //   }catch (error) {
  //       console.error('Registration failed:', error);
  //   }
  // };

  // // Get all trainers
  // const [trainers, setTrainers] = useState([])
  // const getAllTrainers = async() => {
  //   axios.defaults.withCredentials = true;
  //   try {
  //       const response = await axios.get('http://localhost:5000/api/trainer/getAll'); // Replace with your API endpoint
  //       console.log('Get all trainers successful:', response.data);
  //       // setUser(response.data)
  //       setTrainers(response.data)
  //   } catch (error) {
  //       console.error('Get all trainers failed:', error);
  //   }
  // }

  return (
    
    <div className='w-[80vw] h-screen py-4 px-3'>
      <div className='border border-slate-300 p-3 rounded-md'>
        {/* FORM */}
        <form>
          {/* General Details */}
          <div className='mt-10 border p-3 rounded-sm'>
            <PersonalDetails />
          </div>

          {/* Bank Details */}
          <div className='mt-10 border  p-3 rounded-sm '>
            <BankDetails />
          </div>

          {/* Training Details */}
          <div className='mt-10 border  p-3 rounded-sm '>
            {/* <TrainingDetails /> */}
          </div>

          {/* Resume Details */}
          <div className='mt-10 border  p-3 rounded-sm '>
            <ResumeDetails />
          </div>
        </form>


      </div>
    </div>
  );
};

export default AddTrainer;


// <Fragment>
    //   <section>
    //     {/* Edit Trainer details */}

    //     {/* Add Trainer */}
    //       <form onSubmit={handleSubmit}>
    //         {/* Name */}
    //         <div className="trainer-form">
    //           <div>
    //               <label>Name</label>
    //               <input
    //               type="text"
    //               name="name"
    //               value={formData.name}
    //               onChange={handleChange}
    //               // required
    //               />
    //           </div>
    //           <div>
    //               <label>Type of Trainer</label>
    //               <select
    //                 name="type_of_trainer"
    //                 value={formData.type_of_trainer}
    //                 onChange={handleChange}
    //               >
    //                 <option value="Internal">Internal</option>
    //                 <option value="External - Full Time">External - Full Time</option>
    //                 <option value="External - Freelancer">External - Freelancer</option>
    //                 <option value="External - Vendor">External - Vendor</option>

    //               </select>
    //           </div>
    //           <div>
    //               <label>Trainer ID</label>
    //               <input
    //                 type="text"
    //                 name="trainerId"
    //                 value={formData.trainerId}
    //                 onChange={handleChange}
    //                 // required
    //               />
    //           </div>

    //           {/* Password */}
    //           <div>
    //               <label>Password</label>
    //               <input
    //               type="password"
    //               name="password"
    //               value={formData.password}
    //               onChange={handleChange}
    //               // required
    //               />
    //           </div>
    //           <div>
    //             <label htmlFor="">Mode of Training</label>
    //             <select name="training_mode" onChange={handleChange} value={formData.training_mode}>
    //               <option value="Select">Select</option>
    //               {/* 'Full Time', 'Part Time', 'Online', 'Offline' */}
    //               <option value="Full Time">Full Time</option>
    //               <option value="Part Time">Part Time</option>
    //             </select>
    //             {
    //               formData.training_mode && (
    //                 <div>
    //                   <select name="training_type" onChange={handleChange} value={formData.training_type} id="">
    //                     <option value="Select">Select</option>
    //                     <option value="Online">Online</option>
    //                     <option value="Offline">Offline</option>
    //                   </select>
    //                 </div>
    //               )
    //             }
    //             {
    //               formData.training_mode && <span>{formData.training_mode} / {formData.training_type} </span>
    //             }
    //           </div>
    //           <div>
    //               <label>Price </label>
    //               <input
    //                 type="number"
    //                 name="price"
    //                 value={formData.price}
    //                 onChange={handleChange}
    //                 // required
    //               />
                  
    //           </div> 
    //           <div>
    //             <label htmlFor="">Price type</label>
    //             <select
    //                   style={{height: 'max-content'}}
    //                   name="price_type"
    //                   value={formData.price_type}
    //                   onChange={handleChange}
    //                 >
    //                 <option value="hourly">hourly</option>
    //                 <option value="per day">per day</option>
    //               </select>
    //           </div>

    //           <div>
    //               <label>Rating </label>
    //               <input
    //                 type="number"
    //                 name="rating"
    //                 max={10}
    //                 value={formData.rating}
    //                 onChange={handleChange}
    //                 // required
    //               />
                  
    //           </div> 
    //           {/* <div>
    //               <label>Password</label>
    //               <input
    //               type="password"
    //               name="password"
    //               value={formData.password}
    //               onChange={handleChange}
    //               // required
    //               />
    //           </div> */}
    //         </div>


    //         {/* Bank Details */}
    //         <h3>Bank Details</h3>
    //         <div className="trainer-form">
    //           <div>
    //               <label>Account Name</label>
    //               <input
    //               type="text"
    //               name="bank_Details.account_Name"
    //               value={formData.bank_Details.account_Name}
    //               onChange={handleChange}
    //               // required
    //               />
    //           </div>
    //           <div>
    //               <label>Account Number</label>
    //               <input
    //               type="number"
    //               name="bank_Details.account_Number"
    //               value={formData.bank_Details.account_Number}
    //               onChange={handleChange}
    //               // required
    //               />
    //           </div>
    //           <div>
    //               <label>Bank Branch</label>
    //               <input
    //               type="text"
    //               name="bank_Details.bank_Branch"
    //               value={formData.bank_Details.bank_Branch}
    //               onChange={handleChange}
    //               // required
    //               />
    //           </div>
    //           <div>
    //               <label>Bank IFSC Code</label>
    //               <input
    //               type="text"
    //               name="bank_Details.bank_IFSC_code"
    //               value={formData.bank_Details.bank_IFSC_code}
    //               onChange={handleChange}
    //               // required
    //               />
    //           </div>
    //           <div>
    //               <label>Pancard Number</label>
    //               <input
    //               type="number"
    //               name="bank_Details.pancard_Number"
    //               value={formData.bank_Details.pancard_Number}
    //               onChange={handleChange}
    //               // required
    //               />
    //           </div>
    //           {
    //             formData && formData.type_of_trainer === 'External - Vendor' ?
    //             (
    //               <Fragment>
    //                 <div>
    //                   <label>Vendor Name</label>
    //                   <input
    //                     type="text"
    //                     name="bank_Details.vendorName"
    //                     value={formData.bank_Details.vendorName}
    //                     onChange={handleChange}
    //                   // required
    //                   />
    //                 </div>
    //                 <div>
    //                   <label>Gst Number</label>
    //                   <input
    //                     type="number"
    //                     name="bank_Details.gst_number"
    //                     value={formData.bank_Details.gst_number}
    //                     onChange={handleChange}
    //                   // required
    //                   />
    //                 </div>
    //               </Fragment>
    //             )  : null
    //           }


    //         </div>

    //         {/* Contact Details */}
    //         <h3>Contact Details</h3>
    //         <div className="trainer-form">
    //         <div>
    //           <label>Mobile Number</label>
    //           <input
    //             type="text"
    //             name="contact_Details.mobile_number"
    //             value={formData.contact_Details.mobile_number}
    //             onChange={handleChange}
    //             // required
    //           />
    //           <span style={{color:'blue', fontSize:'16px'}} onClick={() => {
    //             setFormData({
    //              ...formData,
    //               contact_Details: {
    //                ...formData.contact_Details,
    //                 whatsapp_number: formData.contact_Details.mobile_number
    //               }
    //             });
    //           }}>same for whatsapp</span>
    //         </div>
    //         <div>
    //           <label>Email ID</label>
    //           <input
    //             type="email"
    //             name="contact_Details.email_id"
    //             value={formData.contact_Details.email_id}
    //             onChange={handleChange}
    //             // required
    //           />
    //         </div>
    //         <div>
    //           <label>Whatsapp Number</label>

    //           <input type="number" name="contact_Details.whatsapp_number" 
    //             value={formData.contact_Details.whatsapp_number}
    //             onChange={handleChange}
    //             id="" />
    //         </div>

    //         </div>

    //         {/* Resume Details */}
    //         <h3>Resume Details</h3>
    //         <div className="trainer-form">
    //           <div>
    //               <label>Professional Summary</label>
    //               {formData.resume_details.professionalSummary.map((summary, index) => (
    //               <input
    //                   key={index}
    //                   type="text"
    //                   value={summary}
    //                   onChange={(e) => handleArrayChange(e, 'professionalSummary', index)}
    //               />
    //               ))}
    //               <button type="button" onClick={() => addArrayRow('professionalSummary')}>
    //               Add Summary
    //               </button>
    //           </div>

    //           {/* Technical Skills */}
    //           <div>
    //               <label>Technical Skills</label>
    //               {formData.resume_details.technicalSkills.map((skill, index) => (
    //               <input
    //                   key={index}
    //                   type="text"
    //                   value={skill}
    //                   onChange={(e) => handleArrayChange(e, 'technicalSkills', index)}
    //               />
    //               ))}
    //               <button type="button" onClick={() => addArrayRow('technicalSkills')}>
    //               Add Skill
    //               </button>
    //           </div>

    //           <div>
    //               <label>Career History</label>
    //               {formData.resume_details.careerHistory.map((skill, index) => (
    //               <input
    //                   key={index}
    //                   type="text"
    //                   value={skill}
    //                   onChange={(e) => handleArrayChange(e, 'careerHistory', index)}
    //               />
    //               ))}
    //               <button type="button" onClick={() => addArrayRow('careerHistory')}>
    //               Add Career
    //               </button>
    //           </div>

    //           <div>
    //               <label>Certifications</label>
    //               {formData.resume_details.certifications.map((skill, index) => (
    //               <input
    //                   key={index}
    //                   type="text"
    //                   value={skill}
    //                   onChange={(e) => handleArrayChange(e, 'certifications', index)}
    //               />
    //               ))}
    //               <button type="button" onClick={() => addArrayRow('certifications')}>
    //               Add certifications
    //               </button>
    //           </div>

    //           <div>
    //               <label>Clientele</label>
    //               {formData.resume_details.clientele.map((skill, index) => (
    //               <input
    //                   key={index}
    //                   type="text"
    //                   value={skill}
    //                   onChange={(e) => handleArrayChange(e, 'clientele', index)}
    //               />
    //               ))}
    //               <button type="button" onClick={() => addArrayRow('clientele')}>
    //               Add clientele
    //               </button>
    //           </div>
    //         </div>

    //         {/* Submit Button */}
    //         <button type="submit">Submit</button>
    //       </form>

    //   </section>
    //   {/* Get all the Trainers */}
    //               {  
    //    currentUser?.role?.name === "ADMIN" ? ( 
    //     <section>
    //       <h2>Get All Trainers</h2>
    //       <button onClick={getAllTrainers}>Get Trainers</button>
    //       {
    //         trainers.length > 0 ? (
    //           <ul>
    //             {trainers.map((trainer) => (
    //               <p key={trainer._id}>{trainer.name} : {trainer.contact_Details.email_id}</p>
    //             ))}
    //           </ul>
    //         ) : null
    //       }
    //     </section> 
    //    ) : "No"
    //  }
    // </Fragment>