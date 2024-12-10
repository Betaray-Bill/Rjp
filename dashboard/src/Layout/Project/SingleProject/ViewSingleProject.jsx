import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import axios from 'axios'
import { useQuery, useQueryClient } from 'react-query'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import Loading from '@/utils/Loading'
import SearchResult from '@/Layout/Search/SearchResult'
import SearchBar from './Components/SearchTrainers/SearchBar'
import ViewTrainers from './Components/ViewTrainers'
import { Button } from '@/components/ui/button'
import ViewCompanyContact from './Components/ViewCompanyContact'
import ViewProjectData from './Components/ViewProjectData'
import Notes from './Components/Notes'
import { useToast } from '@/hooks/use-toast'
import TrainerPurchaseList from './Components/PO/TrainerPurchaseList'
import { userAccess } from '@/utils/CheckUserAccess'
import { RolesEnum } from '@/utils/constants'
import InvoiceList from './Components/Invoice/InvoiceList'

const state = {
  ParticipantList: "Participant List",
  Hotel: "Hotel",
  venue: "Venue",
  Travel: "Travel",
  FB_MTM: "FB/MTM",
  // certificate_Issued: "Certificate Issued",
  Online: "Online",
  InPerson: "In Person",
  Hybrid: "Hybrid",
  FullTime: "Full Time",
  PartTime: "Part Time",
  PO_Payment_terms:"PO & Payment terms",
  NDA_SignedCollection:"NDA - signed copy collection",
  Pre_Req_Test :"Pre -Req -Test ",
  Ref_Material_links__Training_content__Lab_testing__Azure_pass:"Ref Material links / Training content / Lab testing / Azure pass",
  Day_wise_Training_Content:"Day-wise Training Content",
  whitelisting:"whitelisting",
  WhatsAppGroupCreation:"WhatsApp Group Creation",
  MeetingInvite:"Meeting invite",
  LMSInvite:"LMS invite",
  LabDetails:"Lab details",
  certificate_Issued:"Certificates Issued",
  All_Reports_Mailed: "All reports mailed",
};

function ViewSingleProject() {
  // const {currentUser} = useSelector(state => state.auth)

  const projectId = useParams()
  const navigate = useNavigate();
  // const [collapse, setCollapse] = useState(false)
  const queryClient = useQueryClient();
  const {toast} = useToast()

  const [formData, setFormData] = useState({});
  // const [isLoading, setIsLoading] = useState(true);

  const { currentUser } = useSelector(state => state.auth)
  const fetchProjects = async () => {
    const response = await axios.get(`http://localhost:5000/api/project/get-project/${projectId.projectId}`)
    console.log(response.data)
    setFormData({
      Travel: response.data.project.trainingDelivery.Travel,
      Hotel: response.data.project.trainingDelivery.Hotel,
      Online: response.data.project.trainingDelivery.Online,
      InPerson: response.data.project.trainingDelivery.InPerson,
      Hybrid: response.data.project.trainingDelivery.Hybrid,
      FullTime: response.data.project.trainingDelivery.FullTime,
      PartTime: response.data.project.trainingDelivery.PartTime,
      venue: response.data.project.trainingDelivery.venue,
      PO_Payment_terms: response.data.project.trainingDelivery.PO_Payment_terms,
      NDA_SignedCollection: response.data.project.trainingDelivery.NDA_SignedCollection,
      Pre_Req_Test: response.data.project.trainingDelivery.Pre_Req_Test,
      Ref_Material_links__Training_content__Lab_testing__Azure_pass: response.data.project.trainingDelivery.Ref_Material_links__Training_content__Lab_testing__Azure_pass,
      Day_wise_Training_Content: response.data.project.trainingDelivery.Day_wise_Training_Content,
      ParticipantList: response.data.project.trainingDelivery.ParticipantList,
      whitelisting: response.data.project.trainingDelivery.whitelisting,
      WhatsAppGroupCreation: response.data.project.trainingDelivery.WhatsAppGroupCreation,
      MeetingInvite: response.data.project.trainingDelivery.MeetingInvite,
      LMSInvite: response.data.project.trainingDelivery.LMSInvite,
      LabDetails: response.data.project.trainingDelivery.LabDetails,
      All_Reports_Mailed: response.data.project.trainingDelivery.All_Reports_Mailed,
      FB_MTM: response.data.project.trainingDelivery.FB_MTM,
      certificate_Issued: response.data.project.trainingDelivery.certificate_Issued,
      fullTime_start: response.data.project.trainingDelivery.fullTime_start,
      fullTime_end: response.data.project.trainingDelivery.fullTime_end,
      partTime_start: response.data.project.trainingDelivery.partTime_start,
      partTime_end: response.data.project.trainingDelivery.partTime_end,


    })
    return response.data.project
  }
//  console.log(projectId.projectId)
  const { data: projects, isLoading, error } = useQuery(
    ['ViewProject', projectId.projectId], 
    
    fetchProjects,
    {
      enabled: !!projectId.projectId,
      staleTime: 1000 * 60 * 5, // data stays fresh for 5 minutes
      cacheTime: 1000 * 60 * 10 // cache data for 10 minutes
    }
  )
  useEffect(() => {
    if( projects && projects.stages === "Training Delivery"){
      setFormData({
        Travel: projects.trainingDelivery.Travel,
        Hotel: projects.trainingDelivery.Hotel,
        Online: projects.trainingDelivery.Online,
        InPerson: projects.trainingDelivery.InPerson,
        Hybrid: projects.trainingDelivery.Hybrid,
        FullTime: projects.trainingDelivery.FullTime,
        PartTime: projects.trainingDelivery.PartTime,
        venue: projects.trainingDelivery.venue,
        PO_Payment_terms: projects.trainingDelivery.PO_Payment_terms,
        NDA_SignedCollection: projects.trainingDelivery.NDA_SignedCollection,
        Pre_Req_Test: projects.trainingDelivery.Pre_Req_Test,
        Ref_Material_links__Training_content__Lab_testing__Azure_pass: projects.trainingDelivery.Ref_Material_links__Training_content__Lab_testing__Azure_pass,
        Day_wise_Training_Content: projects.trainingDelivery.Day_wise_Training_Content,
        ParticipantList: projects.trainingDelivery.ParticipantList,
        whitelisting: projects.trainingDelivery.whitelisting,
        WhatsAppGroupCreation: projects.trainingDelivery.WhatsAppGroupCreation,
        MeetingInvite: projects.trainingDelivery.MeetingInvite,
        LMSInvite: projects.trainingDelivery.LMSInvite,
        LabDetails: projects.trainingDelivery.LabDetails,
        All_Reports_Mailed: projects.trainingDelivery.All_Reports_Mailed,
        FB_MTM: projects.trainingDelivery.FB_MTM,
        certificate_Issued: projects.trainingDelivery.certificate_Issued,
        fullTime_start:projects.trainingDelivery.fullTime_start,
        fullTime_end:projects.trainingDelivery.fullTime_end,
        partTime_start:projects.trainingDelivery.partTime_start,
        partTime_end:projects.trainingDelivery.partTime_end,
  
      })
    }
  }, [projectId.projectId])


  const handleCheckboxChange = (field) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: prevData[field] === true ? false : true,
    }));
  };

  const handleChange = (e) => {
    console.log(e.target.name, e.target.value)
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value ,
    }));
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // console.log(object)
      const response = await axios.put(`http://localhost:5000/api/project/updateCheckList/${projectId.projectId}`, formData);
      console.log("Response:", response.data);
      // alert("Form submitted successfully!");
      queryClient.invalidateQueries(['ViewProject', projectId.projectId]);
      toast({
        variant: "success",
          title: "Check List updated"
        })
    } catch (error) {
      console.error("Error submitting form:", error);
      // alert("Failed to submit form.");
    }
  };

  // Scroll to a Section
  const sectionRef = useRef(null);
  const [isAdd, setIsAdd] = useState(false)
  const scrollToSection = () => {
    setIsAdd(true)
    setTimeout(() => {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, [100])
    
  };

 
  if (isLoading) return <div><Loading /></div>
  if (error) return <div>Error: {error.message}</div>
  console.log(projects)
  const {_id, notes, company, stages, contactDetails,amount,employees, trainers,trainingDates, projectName, domain, description, modeOfTraining } = projects;


  const fileUpload = async(e) => {
    console.log(e)
    // const upload = axios.post("http://localhost:5000/api/filestorage/upload-to-blob", {folderName:`${projectName}`})
    const upload = await axios.get("http://localhost:5000/api/filestorage/check-blob-connection")
    console.log(upload)
    const res = upload.data
    console.log(res)
  }

  // Check if the part time or full time is checked
  // useEffect(() => {
  //   if(formData.PartTime){

  //   }
  // }, [formData.PartTime])

  return (
    <div className=''>

      <div className='flex items-center justify-between mb-3'>
        <button onClick={() => navigate(-1)} className='flex items-center mt-5 mb-4'>
          <ion-icon name="arrow-back-outline"></ion-icon>
          <span className='ml-2'>Go Back</span>
        </button>
        {/* <div>
          <Button className="rounded-none">Edit</Button>
        </div> */}
      </div>

      {/* <div className='flex items-center justify-start mb-3 border-b'>
        <div className='bg-blue-200 p-2 px-3 hover:cursor-pointer'>
          Overview
        </div>
        <div className=' bg-blue-200 p-2 px-3  hover:cursor-pointer'>
          Notes
        </div>
      </div> */}

      {/* PRoject Data */}
      <ViewProjectData projects={projects}/>

      {/* Company Contact Person - default Hidden */}
      <ViewCompanyContact data={company} contact={contactDetails}/>  

      {/* Show the Trainers Added to the  */}
      <div className='border rounded-md mt-8 py-4 px-3 shadow-sm border-gray-300'>
        <div className='flex items-center justify-between'>
          <div className='font-semibold'>Trainers</div>
          <Button onClick={scrollToSection} className='flex items-center bg-blue-950 rounded-none'>
            <ion-icon name="search-outline" style={{fontSize:"20px"}}></ion-icon>
            <span>Search Trainer</span>
          </Button>
        </div>
        <div>
          {/* Search Bar */}
          <ViewTrainers trainers={trainers} />
      
          {
            isAdd &&(
              <div className='mt-10 border-t pt-5' ref={sectionRef}>
                <div className='text-right'>
                  <ion-icon 
                    onClick={() => setIsAdd(false)}
                    name="close-outline" 
                    style={{fontSize:"22px", cursor:"pointer", borderRadius:"50%", border:"1px solid black"}} ></ion-icon>
                </div>
                <SearchBar domain={domain} id={_id} trainingDates={trainingDates}/>
              </div>
            )
          }
        </div>
      </div>

      {/* PO */}
      <TrainerPurchaseList trainers={trainers} projectName={projectName} />
      {/* <PurchaseOrder /> */}

      {/* Invoice */}
      <InvoiceList trainers={trainers} projectName={projectName} />



      {/* Training Delivery Section - showcase all the conditions */}
      <Fragment>
          {
            stages === "Training Delivery" 
            && 
            <div className='border rounded-md shadow-sm mt-8 py-4 px-4'>
              <h2 className='font-semibold my-4'>Training Delivery - CheckList</h2>
              {
                // JSON.stringify(formData)
              }
              <form onSubmit={handleSubmit} className="space-y-4">
                  <div className='grid grid-cols-3 gap-4 items-start'>

                    {/* Pre Training Delivery */}
                    <div className='grid grid-cols-1 gap-3'>
                      <div key="Travel" className="flex items-center space-x-2">
                        <Checkbox
                          id="Travel"
                          checked={formData.Travel}
                          onCheckedChange={() => handleCheckboxChange('Travel')}
                        />
                        <label htmlFor="Travel" className="capitalize font-normal text-[14px]">
                          Travel
                        </label>
                      </div>
                      <div key="Hotel" className="flex items-center space-x-2">
                        <Checkbox
                          id="Hotel"
                          checked={formData.Hotel}
                          onCheckedChange={() => handleCheckboxChange('Hotel')}
                        />
                        <label htmlFor="Hotel" className="capitalize font-normal text-[14px]">
                          Hotel
                        </label>
                      </div>
                      <div key="Online" className="flex items-center space-x-2">
                        <Checkbox
                          id="Online"
                          checked={formData.Online}
                          onCheckedChange={() => handleCheckboxChange('Online')}
                        />
                        <label htmlFor="Online" className="capitalize font-normal text-[14px]">
                          Online
                        </label>
                      </div>
                      <div key="InPerson" className="flex items-center space-x-2">
                        <Checkbox
                          id="InPerson"
                          checked={formData.InPerson}
                          onCheckedChange={() => handleCheckboxChange('InPerson')}
                        />
                        <label htmlFor="InPerson" className="capitalize font-normal text-[14px]">
                          In-Person
                        </label>
                      </div>
                      <div key="Hybrid" className="flex items-center space-x-2">
                        <Checkbox
                          id="Hybrid"
                          checked={formData.Hybrid}
                          onCheckedChange={() => handleCheckboxChange('Hybrid')}
                        />
                        <label htmlFor="Hybrid" className="capitalize font-normal text-[14px]">
                          Hybrid
                        </label>
                      </div>
                      <div key="FullTime" className="flex items-center space-x-2">
                        <div>
                          <Checkbox
                            id="FullTime"
                            checked={formData.FullTime}
                            onCheckedChange={() => handleCheckboxChange('FullTime')}
                          />
                          <label htmlFor="FullTime" className="capitalize font-normal ml-2 text-[14px]">
                            Full-Time
                          </label>

                        </div>
                        {
                          formData.FullTime && 
                          <div className='block'>
                            <input onChange={(e) => handleChange(e)} value={formData.fullTime_start} type="time" name="fullTime_start" className='border border-black p-'/>
                            <input onChange={(e) => handleChange(e)} value={formData.fullTime_end} type="time" name="fullTime_end" className='border mx-3 border-black p-'/>

                          </div>
                        }
                        
                      </div>
                      <div key="PartTime" className="flex  items-center space-x-2">
                        <div>
                          <Checkbox
                            id="PartTime"
                            checked={formData.PartTime}
                            onCheckedChange={() => handleCheckboxChange('PartTime')}
                          />
                          <label htmlFor="PartTime" className="capitalize font-normal ml-2 text-[14px]">
                            Part-Time
                          </label>
                        </div>
                        {
                          formData.PartTime && 
                          <div className='block'>
                            <input onChange={(e) => handleChange(e)} value={formData.partTime_start}  type="time" name="partTime_start" className='border border-black p-'/>
                            <input onChange={(e) => handleChange(e)} value={formData.partTime_end}  type="time" name="partTime_end" className='border mx-3 border-black p-'/>

                          </div>
                        }
                        
                      </div>
                      <div key="venue" className="flex items-center space-x-2">
                        <Checkbox
                          id="venue"
                          checked={formData.venue}
                          onCheckedChange={() => handleCheckboxChange('venue')}
                        />
                        <label htmlFor="venue" className="capitalize font-normal text-[14px]">
                          Venue
                        </label>
                      </div>
                      <div key="PO_Payment_terms" className="flex items-center space-x-2">
                        <Checkbox
                          id="PO_Payment_terms"
                          checked={formData.PO_Payment_terms}
                          onCheckedChange={() => handleCheckboxChange('PO_Payment_terms')}
                        />
                        <label htmlFor="PO_Payment_terms" className="capitalize font-normal text-[14px]">
                          PO Payment Terms
                        </label>
                      </div>
                      <div key="NDA_SignedCollection" className="flex items-center space-x-2">
                        <Checkbox
                          id="NDA_SignedCollection"
                          checked={formData.NDA_SignedCollection}
                          onCheckedChange={() => handleCheckboxChange('NDA_SignedCollection')}
                        />
                        <label htmlFor="NDA_SignedCollection" className="capitalize font-normal text-[14px]">
                          NDA Signed Collection
                        </label>
                      </div>
                      <div key="Pre_Req_Test" className="flex items-center space-x-2">
                        <Checkbox
                          id="Pre_Req_Test"
                          checked={formData.Pre_Req_Test}
                          onCheckedChange={() => handleCheckboxChange('Pre_Req_Test')}
                        />
                        <label htmlFor="Pre_Req_Test" className="capitalize font-normal text-[14px]">
                          Pre-Req Test
                        </label>
                      </div>
                      <div
                        key="Ref_Material_links__Training_content__Lab_testing__Azure_pass"
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id="Ref_Material_links__Training_content__Lab_testing__Azure_pass"
                          checked={
                            formData.Ref_Material_links__Training_content__Lab_testing__Azure_pass
                          }
                          onCheckedChange={() =>
                            handleCheckboxChange(
                              'Ref_Material_links__Training_content__Lab_testing__Azure_pass'
                            )
                          }
                        />
                        <label
                          htmlFor="Ref_Material_links__Training_content__Lab_testing__Azure_pass"
                          className="capitalize font-normal text-[14px]"
                        >
                          Reference Material Links, Training Content, Lab Testing, Azure Pass
                        </label>
                      </div>
                      <div key="Day_wise_Training_Content" className="flex items-center space-x-2">
                        <Checkbox
                          id="Day_wise_Training_Content"
                          checked={formData.Day_wise_Training_Content}
                          onCheckedChange={() =>
                            handleCheckboxChange('Day_wise_Training_Content')
                          }
                        />
                        <label htmlFor="Day_wise_Training_Content" className="capitalize font-normal text-[14px]">
                          Day-wise Training Content
                        </label>
                      </div>
                      <div key="ParticipantList" className="flex items-center space-x-2">
                        <Checkbox
                          id="ParticipantList"
                          checked={formData.ParticipantList}
                          onCheckedChange={() => handleCheckboxChange('ParticipantList')}
                        />
                        <label htmlFor="ParticipantList" className="capitalize font-normal text-[14px]">
                          Participant List
                        </label>
                      </div>
                      <div key="whitelisting" className="flex items-center space-x-2">
                        <Checkbox
                          id="whitelisting"
                          checked={formData.whitelisting}
                          onCheckedChange={() => handleCheckboxChange('whitelisting')}
                        />
                        <label htmlFor="whitelisting" className="capitalize font-normal text-[14px]">
                          Whitelisting
                        </label>
                      </div>
                      <div key="WhatsAppGroupCreation" className="flex items-center space-x-2">
                        <Checkbox
                          id="WhatsAppGroupCreation"
                          checked={formData.WhatsAppGroupCreation}
                          onCheckedChange={() => handleCheckboxChange('WhatsAppGroupCreation')}
                        />
                        <label htmlFor="WhatsAppGroupCreation" className="capitalize font-normal text-[14px]">
                          WhatsApp Group Creation
                        </label>
                      </div>
                    </div>


                    {/* Training */}
                    <div className='grid grid-cols-1 gap-3'>
                      <div key="Meeting invite" className="flex items-center space-x-2">
                        <Checkbox
                          id="Meeting invite"
                          checked={formData.MeetingInvite}
                          onCheckedChange={() => handleCheckboxChange('MeetingInvite')}
                        />
                        <label htmlFor="Meeting invite" className="capitalize font-normal text-[14px]">
                          Meeting invite
                        </label>
                      </div>
                      <div key="LMS invite" className="flex items-center space-x-2">
                        <Checkbox
                          id="LMS invite"
                          checked={formData.LMSInvite}
                          onCheckedChange={() => handleCheckboxChange('LMSInvite')}
                        />
                        <label htmlFor="LMS invite" className="capitalize font-normal text-[14px]">
                          LMS invite
                        </label>
                      </div>
                      <div key="Lab details" className="flex items-center space-x-2">
                        <Checkbox
                          id="Lab details"
                          checked={formData.LabDetails}
                          onCheckedChange={() => handleCheckboxChange('LabDetails')}
                        />
                        <label htmlFor="Lab details" className="capitalize font-normal text-[14px]">
                          Lab details
                        </label>
                      </div>
                      <div key="All reports mailed" className="flex items-center space-x-2">
                        <Checkbox
                          id="All reports mailed"
                          checked={formData.All_Reports_Mailed}
                          onCheckedChange={() => handleCheckboxChange('All_Reports_Mailed')}
                        />
                        <label htmlFor="All reports mailed" className="capitalize font-normal text-[14px]">
                          All reports mailed
                        </label>
                      </div>
                    </div>

                    {/* POst Training */}
                    <div className='grid grid-cols-1 gap-3'>
                      <div key="FB/MTM" className="flex items-center space-x-2">
                        <Checkbox
                          id="FB/MTM"
                          checked={formData.FB_MTM}
                          onCheckedChange={() => handleCheckboxChange('FB_MTM')}
                        />
                        <label htmlFor="FB/MTM')}" className="capitalize font-normal text-[14px]">
                          FB/MTM
                        </label>
                      </div>
                      <div key="Certificates Issued" className="flex items-center space-x-2">
                        <Checkbox
                          id="Certificates Issued"
                          checked={formData.certificate_Issued}
                          onCheckedChange={() => handleCheckboxChange('certificate_Issued')}
                        />
                        <label htmlFor="Certificates Issued" className="capitalize font-normal text-[14px]">
                          Certificates Issued
                        </label>
                      </div>
                    </div>


                  </div>

                <Button type="submit" className="mt-4 inline-block">
                  Submit
                </Button>
              </form>
            </div>
          }

      </Fragment>

      {userAccess([
                    RolesEnum.ADMIN,  RolesEnum.KEY_ACCOUNT
                ], currentUser
                    ?.employee.role) && 
      <Notes projectName={projectName} projectId={_id} notes={notes}/>
              }
    </div>
  )
}

export default ViewSingleProject
