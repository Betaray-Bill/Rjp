import { Button } from '@/components/ui/button';
// import { Command } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import { Textarea } from '@/components/ui/textarea';
import { setResumeDetails } from '@/features/trainerSlice';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from "@/components/ui/command"
import { useToast } from '@/hooks/use-toast';
import { domains } from '@/utils/constants';
import axios from 'axios';
import React, { useRef, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from 'react-query';

function    ViewNewResume({data, projects}) {
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isEdit, setIsEdit] = useState(true)
    const [extractedData, setExtractedData] = useState(null);
    const [error, setError] = useState(null);
    const [resume, setResume] = useState()
    const {toast} = useToast()
    const navigate = useNavigate()
    const params = useParams()
    const queryClient = useQueryClient();


    const [open,
        setOpen] = useState(false)
    // console.log(resume)
    useEffect(() => {
        if(data){
          setResume({
              professionalSummary: data ? data.professionalSummary : [],
              technicalSkills: data ? data.technicalSkills : [],
              careerHistory: data ? data.careerHistory : [],
              certifications: data ? data.certifications : [],
              education: data ? data.education : [],
              trainingsDelivered: data ? data.trainingsDelivered : [],
              clientele: data ? data.clientele : [],
              experience: data ? data.experience : [],
              projects: data ? data.projects : [],
              domain:data ? data.domain : ""
            })
          // setExtractedData(data)
          // setIsEdit(false)
        }
  
      }, [])
    
  
    const dispatch = useDispatch()
  
    // -----------------------Render the Resume Details Sections -------------------------------
    
    const handleChange = (e, field, index) => {
      const value = e.target.value;
      let updateResume = () => {
        if(Array.isArray(resume[field])) {
          const updatedArray = [...resume[field]];
          updatedArray[index] = value;
  
          return {
              ...resume,
              [field]: updatedArray
          };
        }else{
          return {
             ...resume,
              [field]: value
          };
      }
    }
  
    // console.log("Resume Details ", updateResume())
    setResume((prevState) => {
          // Update array fields based on the index
          if (Array.isArray(prevState[field])) {
              const updatedArray = [...prevState[field]];
              updatedArray[index] = value;
  
              return {
                  ...prevState,
                  [field]: updatedArray
              };
          }
  
          // For non-array fields
          return {
              ...prevState,
              [field]: value
          };
      });
  
    //   console.log("Resume is ", resume)
      dispatch(setResumeDetails({name: "mainResume", data: updateResume()}))
  
    };
  
    // Handler to add a new empty textarea for a specific field
    const handleAdd = (field) => {
            setResume((prevState) => {
            //   console.log(prevState)
                return {
                    ...prevState,
                    [field]: [
                        ...prevState[field],
                        ''
                    ], // Add empty string to the field array
                };
            });
    };
  
    // Handler to delete an item from a specific field
    const handleDelete = (field, index) => {
            setResume((prevState) => {
                const updatedArray = prevState[field].filter((_, i) => i !== index);
                return {
                    ...prevState,
                    [field]: updatedArray
                };
            });
    };
  
    // Function to render textareas for array fields
    const renderTextareas = (fieldArray, fieldName) => {
        if (fieldArray?.length === 0) {
            return (
                <div
                    key={0}
                    className='py-2 flex justify-between align-top items-start border border-gray-200 px-2 my-2 rounded-md'>
                    <Textarea
                        value=""
                        // readOnly={isEdit}
                        onChange={(e) => handleChange(e, fieldName, 0)}
                        placeholder={`Type your ${fieldName}`}
                        className=" text-gray-800 text-sm outline-none border-collapse border-none"/>
                </div>
            )
        }
        return Array.isArray(fieldArray) ? 
        fieldArray?.map((value, index) => (
          <div
              key={index}
              className='py-2 flex justify-between align-top items-start border    border-gray-200 p-2 my-2 rounded-md'>
              <Textarea
                  value={value}
                  // readOnly={isEdit}
                  onChange={(e) => handleChange(e, fieldName, index)}
                  placeholder={`Type your ${fieldName}`}
                  className="text-gray-800 text-sm outline-none border-collapse border-none"/>
              <ion-icon
                  name="trash-outline"
                  style={{
                  color: "rgba(246, 43, 43, 0.644)",
                  fontSize: "18px",
                  cursor: "pointer"
              }}
                  onClick={() => handleDelete(fieldName, index)}></ion-icon>
          </div>
        )) : <div
            className='py-2 flex justify-between align-top items-start border    border-gray-200 px-2 my-2 rounded-md'>
            <Textarea
                value={fieldArray}
                // readOnly={isEdit}
                onChange={(e) => handleChange(e, fieldName, index)}
                placeholder={`Type your ${fieldName}`}
                className="text-gray-800 text-sm outline-none border-collapse border-none h-max"/>
            <ion-icon
                name="trash-outline"
                style={{
                color: "rgba(246, 43, 43, 0.644)",
                fontSize: "18px",
                cursor: "pointer"
            }}
                onClick={() => handleDelete(fieldName, index)}></ion-icon>
        </div>
      };

    const submitResumeHandler = async(e) => {
        e.preventDefault()
        // http://localhost:5000/api/trainer/updateResume/671f1f348706010ba634eb92/resume/671f1f348706010ba634eb8f
        // console.log(`http://localhost:5000/api/trainer/updateResume/671f1f348706010ba634eb92/resume/${data._id}`)
        // console.log(resume)
        try{
            // console.log("object")
            console.log(resume)
            let res = {...resume, domain:value}
            await axios.post(`http://localhost:5000/api/trainersourcer/${params.id}/copy-resume`, res)

            toast({
                title:"New Resume Is Created",
                description: "New Resume Has Been Created Successfully",
                status: "success",
                duration: 5000
            })

             queryClient.invalidateQueries(['getTrainerById', params.id]);
            
        }catch(e){
            console.error(e)
            setError('Failed to submit the resume')
        }

    }
     // Select Project to the Resume
    const addProjectToResume = async(projectId) => {
        console.log(projectId)
        if(projectId == ""){
            alert("Please select a project")
            return
        }
        setResume({...resume, projects:projectId})
    }
    const {trainerDetails} = useSelector(state  => state.currentTrainer)

    console.log(resume)
    const [filteredResults, setFilterResults] = useState(domains);
    const [value,
        setValue] = useState("")
        console.log(value)
    
    const getFilteredResults = (searchTerm) => {
        setValue(searchTerm)
        console.log(searchTerm)
        if (!searchTerm) return [];
        console.log("searchTerm", searchTerm)
        const lowercasedTerm = searchTerm.toLowerCase();

        const a = domains
            .map((domain) => {
                const filteredSubtopics = domain.subtopics
                    .map((subtopic) => {
                        // Include subtopic if its name or topic matches, or any of its points match
                        const matchesSubtopic = subtopic.subtopic.toLowerCase().includes(lowercasedTerm);
                        const matchesTopic = domain.topic.toLowerCase().includes(lowercasedTerm);

                        // Filter points that match the search term
                        const filteredPoints = subtopic.points.filter((point) =>
                            point.toLowerCase().includes(lowercasedTerm)
                        );

                        // If subtopic or topic matches, include all points; otherwise, include only filtered points
                        if (matchesSubtopic || matchesTopic || filteredPoints.length > 0) {
                            return { ...subtopic, points: matchesSubtopic || matchesTopic ? subtopic.points : filteredPoints };
                        }

                        return null;
                    })
                    .filter((subtopic) => subtopic !== null);

                // Include the domain if it has any matching subtopics
                if (filteredSubtopics.length > 0) {
                    return { ...domain, subtopics: filteredSubtopics };
                }

                return null;
            })
            .filter((domain) => domain !== null);

        console.log("A ", a)
        setFilterResults(a);
    };

    const [resLoading, setResLoading] = useState(false)
    const sortDataByDomain = (domain) => {
        // Helper function to sort a single array based on the domain
        const sortArray = (array, domain) => {
            if (Array.isArray(array)) {
                return [...array].sort((a, b) => { // Use spread to create a new array
                    let aContainsDomain = a.toLowerCase().includes(domain.toLowerCase());
                    let bContainsDomain = b.toLowerCase().includes(domain.toLowerCase());
                    return bContainsDomain - aContainsDomain; // Sort items with domain first
                });
            }
            return array;
        };
    
        // Create a deep clone of the `resume` object to avoid direct mutations
        let data = JSON.parse(JSON.stringify(resume)); // Deep clone
    
        // Iterate over each key in the data object and sort if it's an array
        for (let key in data) {
            if (Array.isArray(data[key]) && data[key].length > 0 && key !== "projects") {
                data[key] = sortArray(data[key], domain); // Sort and reassign the cloned array
            }
        }
    
        setResume(data); // Update the state with the sorted data
        // return data;
        console.log(data)
    };
    
    // Example usage with "Ansible" as the domain
    // sortDataByDomain("Ansible");
    
    
    // console.log(resume)
    const handleSearchTerm = (e) => {
        console.log(e)
        setValue(e)
        
            setResume({...resume, domain:e})
            setResLoading(true)   // True

            // Sort the Result
            sortDataByDomain(e)
    


    }

  
    return ( 
        <div className='mt-8'> 

        {/* {
            !resLoading ? */}
        
            <form onSubmit={submitResumeHandler}>

                <div className='flex items-center justify-between my-9'>
                    <div>
                        {
                            trainerDetails.projects.length > 0 ? 
                            (
                                <div className='flex items-center'>
                                    <select name="" id="" onChange={(e) => {
                                        addProjectToResume(e.target.value)
                                    }}>
                                        <option value="">Add to a Project</option>
                                        {
                                            trainerDetails?.projects?.map(project => (
                                                <option key={project._id} value={project._id}>{project.projectName}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                            ) : (
                                <div className='flex items-center'>
                                    <p className='text-sm text-gray-500'>No projects assigned yet.</p>
                                </div>
                            )
                        }
                    </div>
                    <Popover open={open} onOpenChange={setOpen} className="justify-start p-2">
                                <PopoverTrigger asChild className='p-6 rounded-md'>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={open}
                                        className="justify-between"
                                    >
                                        {!value ? (
                                            <span className="flex items-center justify-between">
                                                <ion-icon
                                                    name="search-outline"
                                                    style={{ fontSize: "18px", marginRight: "12px" }}
                                                ></ion-icon>
                                                Select Domain
                                            </span>
                                        ) : (
                                            <span className='flex items-center align-middle'>

                                                <div className='flex items-center justify-between  align-middle ml-10 text-slate-700'>
                                                    <span>{value}</span>
                                                    {/* <ion-icon name="close-outline" style={{ fontSize: "18px", marginLeft: "12px" }} onClick={
                                                        () => {
                                                            setOpen(false);
                                                            setValue('');
                                                            setFilterResults(domains);
                                                        }
                                                    }></ion-icon> */}
                                                </div>
                                            </span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className=" p-0">
                                    <Command>
                                        <Input  className="w-max m-2 focus:ring-0 focus:ring-offset-0"    
                                            placeholder="Search Domain by..... "
                                            onChange={(e) =>{
                                                getFilteredResults(e.target.value)
                                                console.log(e)
                                            }}
                                            // value={value}
                                        />
                                        <CommandList>
                                            {/* <CommandEmpty>No results found.</CommandEmpty> */}
                                            {filteredResults?.map((domain) => (
                                                <CommandGroup key={domain.topic} heading={domain.topic}>
                                                    {domain.subtopics.map((subtopic) => (
                                                        <CommandGroup key={subtopic.subtopic} heading={subtopic.subtopic}>
                                                            {subtopic.points.map((point) => (
                                                                <CommandItem
                                                                    key={point}
                                                                    value={point}
                                                                    onSelect={() => handleSearchTerm(point)}
                                                                >
                                                                    {point}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    ))}
                                                </CommandGroup>
                                            ))}
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                    </Popover>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 items-start '>
                    <div className='mt-4 rounded-sm p-2'>
                        <h3 className='font-semibold flex justify-between items-center'>
                            <span>Professional Summary:</span>
                            <ion-icon
                                name="add-outline"
                                style={{
                                fontSize: "18px"
                            }}
                                onClick={() => handleAdd('professionalSummary')}></ion-icon>
                        </h3>
                        {renderTextareas(resume?.professionalSummary, 'professionalSummary')}
                    </div>
    
                    {/* Technical Skills */}
                    <div className='mt-4 p-3'>
                        <h3 className='font-semibold flex justify-between items-center'>
                            <span>Technical Skills:</span>
                            <ion-icon
                                name="add-outline"
                                style={{
                                fontSize: "18px"
                            }}
                                onClick={() => handleAdd('technicalSkills')}></ion-icon>
                        </h3>
                        {renderTextareas(resume?.technicalSkills, 'technicalSkills')}
                    </div>
    
                    {/* Career History */}
                    <div className='mt-4 p-3'>
                        <h3 className='font-semibold flex justify-between items-center'>
                            <span>Career History:</span>
                            <ion-icon
                                name="add-outline"
                                style={{
                                fontSize: "18px"
                            }}
                                onClick={() => handleAdd('careerHistory')}></ion-icon>
                        </h3>
                        {renderTextareas(resume?.careerHistory, 'careerHistory')}
                    </div>
    
                    {/* Certifications */}
                    <div className='mt-4 p-3'>
                        <h3 className='font-semibold flex justify-between items-center'>
                            <span>Certifications:</span>
                            <ion-icon
                                name="add-outline"
                                style={{
                                fontSize: "18px"
                            }}
                                onClick={() => handleAdd('certifications')}></ion-icon>
                        </h3>
                        {renderTextareas(resume?.certifications, 'certifications')}
                    </div>
    
                    {/* Education */}
                    <div className='mt-4 p-3'>
                        <h3 className='font-semibold flex justify-between items-center'>
                            <span>Education:</span>
                            <ion-icon
                                name="add-outline"
                                style={{
                                fontSize: "18px"
                            }}
                                onClick={() => handleAdd('education')}></ion-icon>
                        </h3>
                        {renderTextareas(resume?.education, 'education')}
                    </div>
    
                    {/* Trainings Delivered */}
                    <div className='mt-4 p-3'>
                        <h3 className='font-semibold flex justify-between items-center'>
                            <span>Training Delivered:</span>
                            <ion-icon
                                name="add-outline"
                                style={{
                                fontSize: "18px"
                            }}
                                onClick={() => handleAdd('trainingsDelivered')}></ion-icon>
                        </h3>
                        {renderTextareas(resume?.trainingsDelivered, 'trainingsDelivered')}
                    </div>
    
                    {/* Clientele */}
                    <div className='mt-4 p-3'>
                        <h3 className='font-semibold flex justify-between items-center'>
                            <span>Clientele:</span>
                            <ion-icon
                                name="add-outline"
                                style={{
                                fontSize: "18px"
                            }}
                                onClick={() => handleAdd('clientele')}></ion-icon>
                        </h3>
                        {renderTextareas(resume?.clientele, 'clientele')}
                    </div>
    
                    {/* Experience */}
                    <div className='mt-4 p-3'>
                        <h3 className='font-semibold flex justify-between items-center'>
                            <span>Experience:</span>
                            <ion-icon
                                name="add-outline"
                                style={{
                                fontSize: "18px"
                            }}
                                onClick={() => handleAdd('experience')}></ion-icon>
                        </h3>
                        {renderTextareas(resume?.experience, 'experience')}
                    </div>
    
                </div>
                <div className='justify-center flex mt-8'>
                <Button type="submit">Submit</Button>
                </div>
            </form> 
            {/* : 
            <div className='w-max grid place-content-center'>
                <img src="https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif" alt="" />
            </div>
        
        } */}
        </div>
    )
  }
  

export default ViewNewResume
