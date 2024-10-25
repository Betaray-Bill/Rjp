import {Button} from '@/components/ui/button';
import {setIsDownload} from '@/features/resumeSlice';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import React, {Fragment, useEffect, useRef} from 'react'
import {useDispatch, useSelector} from 'react-redux';
import ResumeLogo from '../../assets/ResumeLogo.png'
import generatePDF, {Margin, Resolution, usePDF} from 'react-to-pdf';

function ResumeDownload() {
    console.log()
    const {currentResumeDetails, currentResumeName, downloadResume, downloadResumeName} = useSelector(state => state.resume)
    const resumeRef = useRef();
    const {user} = useSelector(state => state.auth)
    const dispatch = useDispatch()

    console.log(currentResumeDetails)
    console.log(currentResumeName)

    useEffect(() => {
        console.log("Dowload obj")
        if (downloadResume && downloadResumeName === currentResumeName) {
            // handleDownload()
            console.log("yes")
            dispatch(setIsDownload({bool: false, name: ''}))
        }
    }, [downloadResume, currentResumeName])

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
        { title: "PROFESSIONAL SUMMARY", content: currentResumeDetails['professionalSummary'] },
        { title: "TECHNICAL SKILLS", content: currentResumeDetails['technicalSkills'] },
        { title: "CLIENTELE", content: currentResumeDetails['clientele'] },
        { title: "CAREER HISTORY", content: currentResumeDetails['careerHistory'] },
        { title: "TRAININGS DELIVERED", content: currentResumeDetails['trainingsDelivered'] },
        { title: "EXPERIENCE", content: currentResumeDetails['experience'] },
        { title: "CERTIFICATIONS", content: currentResumeDetails['certifications'] },
        { title: "EDUCATION", content: currentResumeDetails['education'] },
    ].filter(item => item.content.length > 0);  // Filter out empty sections
    
    // Shuffle the content for randomness
    const shuffledContent = allContent;
    
    // Split content evenly between two columns
    const half = Math.ceil(shuffledContent.length / 2);
    const leftColumnContent = shuffledContent.slice(0, half);
    const rightColumnContent = shuffledContent.slice(half);

    return (
        <Fragment>
            <div className="flex justify-end m-4">
                <Button onClick={handleDownload}>Download</Button>
            </div>
            <hr className='pb-8'/>
            <div className='h-full'>
                {/* New template */}
                <div
                    className="bg-white w-[80vw] h-max relative"
                    ref={resumeRef}
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
                            <h1 className="text-3xl font-bold text-resumeText mb-10">{user
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
    // </div>
    )
}

export default ResumeDownload
