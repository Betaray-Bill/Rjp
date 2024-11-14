// import React from 'react'
import { useParams } from 'react-router-dom'
// import {Button} from '@/components/ui/button';
// import {setIsDownload} from '@/features/resumeSlice';
import React, {Fragment, useEffect, useRef} from 'react'
// import {useDispatch, useSelector} from 'react-redux';
import ResumeLogo from '../../assets/ResumeLogo.png'
import generatePDF, {Margin, Resolution, usePDF} from 'react-to-pdf';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useSelector } from 'react-redux';


function Resume() {
    const params = useParams()
    console.log(params)
    const {currentUser} = useSelector(state => state.auth)
    const fetchResume = async(id) => {
        return axios.get(`http://localhost:5000/api/trainer/resume/${id}`).then(res => res.data);
    }

    const { data, isLoading, isError, error } = useQuery(
        ['resume', params.id], // Query key (unique per query)
        () => fetchResume(params.id), // Query function
        {
          enabled: !!params.id, // Ensure query runs only if ID is present
        }
      );
    
      if (isLoading) {
        return <div>Loading...</div>;
      }
    
      if (isError) {
        return <div>Error: {error.message}</div>;
      }

    console.log()
    // const {currentResumeDetails, currentResumeName, downloadResume, downloadResumeName} = useSelector(state => state.resume)
    // const resumeRef = useRef();


    const handleDownload = () => {
        const element = resumeRef.current;
        console.log(element)
        const getTargetElement = () => document.getElementById("resumeRef");
        console.log(getTargetElement)
            generatePDF(getTargetElement, {
                filename: `${user.generalDetails.name}-${currentResumeName}`,
                overrides: {
                    // see https://artskydj.github.io/jsPDF/docs/jsPDF.html for more options
                    pdf: {
                        compress: true
                    },
                    // see https://html2canvas.hertzen.com/configuration for more options
                    canvas: {
                        useCORS: true
                    }
                }
            })
  
    };

    // Function to shuffle an array (for randomness)
    const shuffleArray = (array) => {
        return array.sort(() => Math.random() - 0.5);
    };
    
    const allContent = [
        { title: "PROFESSIONAL SUMMARY", content: data['professionalSummary'] },
        { title: "TECHNICAL SKILLS", content: data['technicalSkills'] },
        { title: "CLIENTELE", content: data['clientele'] },
        { title: "CAREER HISTORY", content: data['careerHistory'] },
        { title: "TRAININGS DELIVERED", content: data['trainingsDelivered'] },
        { title: "EXPERIENCE", content: data['experience'] },
        { title: "CERTIFICATIONS", content: data['certifications'] },
        { title: "EDUCATION", content: data['education'] },
    ].filter(item => item.content.length > 0);  // Filter out empty sections
    
    // Shuffle the content for randomness
    const shuffledContent = allContent;
    
    // Split content evenly between two columns
    const half = Math.ceil(shuffledContent.length / 2);
    const leftColumnContent = shuffledContent.slice(0, half);
    const rightColumnContent = shuffledContent.slice(half);



  return (
  <Fragment>
            {/* <div className="flex justify-end m-4">
                <Button onClick={handleDownload}>Download</Button>
            </div> */}
            <hr className='pb-8'/>
            <div className='h-full'>
                {/* New template */}
                <div
                    className="bg-white w-[80vw] h-max relative"
                    // ref={resumeRef}
                    id="resumeRef">
                      
                    {/* Blue strip on the left */}
                    <div className="absolute top-0 bottom-0 left-0 w-8 h-full bg-resumeText"></div>

                    {/* Main content */}
                    <div className="pl-12 pr-6 py-6 h-full">

                        {/* Header with logo space */}
                        <div className="flex flex-col items-center mb-6 relative">
                            <div className="flex justify-center w-[40vw]">
                                <img src={ResumeLogo} alt="Logo" className="mb-8  w-[40vw]"/>
                            </div>
                        </div>
                        <div className="">
                            <h1 className="text-3xl font-bold text-resumeText mb-10">{data && data.trainer_id
                                    .generalDetails
                                    .name
                                    .toUpperCase()}</h1>
                        </div>
                        
                        {/* Resume content */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-4">
                            {/* Left Column */}
                            <div className="space-y-10">
                            {leftColumnContent.map((section, index) => (
                                <div key={index}>   
                                <h2 className="text-resumeText text-2xl font-semibold mb-2 border-y border-resumeLine py-1 px-4">
                                    {section.title}
                                </h2>
                                <ul className="list-disc pl-5 space-y-2">
                                    {section.content.map((item, _i) => (
                                    <li className="text-justify text-base leading-7" key={_i}>
                                        {item}
                                    </li>
                                    ))}
                                </ul>
                                </div>
                            ))}
                            </div>

                            {/* Right Column */}
                            <div className="space-y-10">
                            {rightColumnContent.map((section, index) => (
                                <div key={index}>
                                <h2 className="text-resumeText text-2xl font-semibold mb-2 border-y border-resumeLine py-1 px-4">
                                    {section.title}
                                </h2>
                                <ul className="list-disc pl-5 space-y-2">
                                    {section.content.map((item, _i) => (
                                    <li className="text-justify text-base leading-7" key={_i}>
                                        {item}
                                    </li>
                                    ))}
                                </ul>
                                </div>
                            ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </Fragment>
  )
}

export default Resume
