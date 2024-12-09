// import React from 'react'
import { useParams } from 'react-router-dom'
// import {Button} from '@/components/ui/button';
// import {setIsDownload} from '@/features/resumeSlice';
import React, {Fragment, useEffect, useRef, useState} from 'react'
// import {useDispatch, useSelector} from 'react-redux';
import ResumeLogo from '../../assets/ResumeLogo.png'
import generatePDF, {Margin, Resolution, usePDF} from 'react-to-pdf';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';

// import { Document, Page } from '@react-pdf/renderer'; 

// import { PDFViewer
function ResumeDownload() {
    const params = useParams()
    console.log(params)
    const {currentUser} = useSelector(state => state.auth)
    const resumeRef = useRef();
    const contentRef = useRef();
    const blue = useRef();

    const fetchResume = async(id) => {
        return axios.get(`http://localhost:5000/api/trainer/resume/${id}`).then(res => res.data);
    }

    const roundHeight = (height) => {
        const multiple = 1735; // Page height multiple
        if(height <= 1735){
            console.log("same", height)
            return 1735
        }
        const numberOfPages = Math.ceil(height / multiple);
        return numberOfPages * multiple;
      };    
    
      // Query to fetch resume data
      const { data, isLoading, isError, error } = useQuery(
        ['resume', params.id],
        () => fetchResume(params.id),
        { enabled: !!params.id }
      );
    
      useEffect(() => {
        // Adjust the blue strip height after rendering
        if (resumeRef.current && blue.current) {
          const height = contentRef.current.offsetHeight;
          const roundedHeight = roundHeight(height);
          console.log("Content ",height, "Rounded ",roundedHeight, "Blue", blue.current.offsetHeight)
          blue.current.style.height = `${roundedHeight}px`;
          resumeRef.current.style.height = `${roundedHeight}px`;
          console.log(height, roundedHeight, blue.current.offsetHeight)
          console.log("Content ",  contentRef.current.offsetHeight)
          console.log("Resume ",  resumeRef.current.offsetHeight)
          console.log("BLue ",  blue.current.offsetHeight)

        }
        console.log(data)
      }, [data]);
    
      const handleDownload = () => {
        if (resumeRef.current && blue.current) {
          const height = contentRef.current.offsetHeight;
          const roundedHeight = roundHeight(height);
          blue.current.style.height = `${roundedHeight}px`;
        }
        console.log('Downloading resume...');
        console.log("Strip ", blue.current.offsetHeight)
        console.log("Resume COntent height ",contentRef.current.offsetHeight)

        const element = resumeRef.current;
        const getTargetElement = () => document.getElementById("resumeRef");
        
            generatePDF(getTargetElement, {
                filename: `${data.trainer_id
                                    .generalDetails
                                    .name}`,
                                    
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
    
      if (isLoading) return <div>Loading...</div>;
      if (isError) return <div>Error: {error.message}</div>;
    
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
    
 
  return (
  <Fragment>
            <div className="flex justify-end m-4">
                <Button onClick={handleDownload}>Download</Button>
            </div>
            <hr className='pb-8'/>
            <div>
                {/* New template */}
                <div
                    className="bg-white w-[80vw]  relative"
                    ref={resumeRef}
                    style={{ height: `${roundHeight(resumeRef.current?.offsetHeight)}px`}}
                    id="resumeRef">
                      
                    {/* Blue strip on the left */}
                    <div className="absolute top-0 bottom-0 left-0 w-8  bg-resumeText" id="blue" ref={blue}></div>
                    {/* style={{ height: `${roundHeight(resumeRef.current?.offsetHeight)}px`}} */}
                    {/* Main content */}
                    <div className="pl-12 pr-6 py-6 " ref={contentRef}>

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
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-10 mt-4">
                            {/* Left Column */}
                            <div className="space-y-10">
                            {allContent.map((section, index) => (
                                <div key={index}>   
                                <h2 className="text-resumeText text-2xl font-semibold mb-2  py-1 px-4">
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
                            {/* <div className="space-y-10">
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
                            </div> */}
                        </div>

                    </div>
                </div>
            </div>
        </Fragment>
  )
}

export default ResumeDownload
