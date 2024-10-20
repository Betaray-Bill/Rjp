import { Button } from '@/components/ui/button';
import { setIsDownload } from '@/features/resumeSlice';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import React, { Fragment, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import ResumeLogo from '../../assets/ResumeLogo.png'

function ResumeDownload() {
  console.log()
  const {currentResumeDetails, currentResumeName,downloadResume, downloadResumeName} = useSelector(state => state.resume)
  const resumeRef = useRef();
  const {user}  = useSelector(state => state.auth)
  const dispatch = useDispatch()
  
  console.log(currentResumeDetails)
  console.log(currentResumeName)
  

  useEffect(() => {
    console.log("Dowload obj")
    if (downloadResume && downloadResumeName === currentResumeName) {
        // handleDownload()
        console.log("yes")
        dispatch(setIsDownload({
            bool: false, name: ''
        }))
    }
  }, [downloadResume, currentResumeName])

const handleDownload = () => {
    const element = resumeRef.current;
    console.log("object")
    html2canvas(element, { scale: 2 })
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const width = pdf.internal.pageSize.getWidth(); // Width of A4 page in mm
        const height= (canvas.height*width)/canvas.width; // Height of A4 page;
        pdf.addImage(imgData, 'PNG', 0, 0, width, height);

        dispatch(setIsDownload({
          bool:false, name:""
        }))
        pdf.save(`${user.generalDetails.name}-${currentResumeName}`);
      })
      .catch((error) => {
        console.error('Error generating PDF: ', error);
      });
};
  return (
    <Fragment>
      <div className="flex justify-end m-4">
        <Button onClick={handleDownload}>Download</Button>
      </div>
      <div ref={resumeRef}>
        {/* New template */}
        <div className="bg-white w-[80vw] relative">
          {/* Blue strip on the left */}
          <div className="absolute top-0 left-0 w-8 h-full bg-blue-600"></div>
          
          {/* Main content */}
          <div className="pl-12 pr-6 py-6">

            {/* Header with logo space */}
            <div className="flex flex-col items-center mb-6 relative">
              <div className="flex justify-center w-full">
                <img
                  src={ResumeLogo}
                  alt="Logo"
                  className="mb-10"
                />
              </div>
            </div>
            <div className="">
                <h1 className="text-4xl font-bold text-blue-600 mb-10">{user.generalDetails.name}</h1>
            </div>
            {/* Resume content */}
            <div className="grid grid-cols-2 gap-4 mt-4">

              <div>
                <h2 className="text-blue-600 text-2xl font-semibold mb-2 inline-block border-y-2 border-blue-600 py-1 px-4">PROFESSIONAL SUMMARY</h2>
                <ul className="list-disc pl-5">
                  {currentResumeDetails['professionalSummary']?.map((e, _i) => (
                    <li className='text-[18px]' key={_i}>{e}</li>
                  ))}
                </ul>

                <h2 className="text-blue-600 text-2xl font-semibold mt-4 mb-2 inline-block border-y-2 border-blue-600 py-1 px-4">TECHNICAL SKILLS</h2>
                <ul className="list-disc pl-5">
                  {currentResumeDetails['technicalSkills']?.map((e, _i) => (
                    <li className='text-[18px]' key={_i}>{e}</li>
                  ))}
                </ul>

                <h2 className="text-blue-600 text-2xl font-semibold mt-4 mb-2 inline-block border-y-2 border-blue-600 py-1 px-4">CAREER HISTORY</h2>
                <ul className="list-disc pl-5">
                  {currentResumeDetails['careerHistory']?.map((e, _i) => (
                    <li className='text-[18px]' key={_i}>{e}</li>
                  ))}
                </ul>

                <h2 className="text-blue-600 text-2xl font-semibold mt-4 mb-2 inline-block border-y-2 border-blue-600 py-1 px-4">CLIENTELE</h2>
                <ul className="list-disc pl-5 grid grid-cols-3">
                  {currentResumeDetails['clientele']?.map((e, _i) => (
                    <li className='text-[18px]' key={_i}>{e}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-blue-600 text-2xl font-semibold mb-2 inline-block border-y-2 border-blue-600 py-1 px-4">TRAININGS DELIVERED</h2>
                <ul className="list-disc pl-5">
                  {currentResumeDetails['trainingsDelivered']?.map((e, _i) => (
                    <li className='text-[18px]' key={_i}>{e}</li>
                  ))}
                </ul>

                <h2 className="text-blue-600 text-2xl font-semibold mt-4 mb-2 inline-block border-y-2 border-blue-600 py-1 px-4">CERTIFICATIONS</h2>
                <ul className="list-disc pl-5">
                  {currentResumeDetails['certifications']?.map((e, _i) => (
                    <li className='text-[18px]' key={_i}>{e}</li>
                  ))}
                </ul>

                <h2 className="text-blue-600 text-2xl font-semibold mt-4 mb-2 inline-block border-y-2 border-blue-600 py-1 px-4">EXPERIENCE</h2>
                <ul className="list-disc pl-5">
                  {currentResumeDetails['experience']?.map((e, _i) => (
                    <li className='text-[18px]' key={_i}>{e}</li>
                  ))}
                </ul>

                <h2 className="text-blue-600 text-2xl font-semibold mt-4 mb-2 inline-block border-y-2 border-blue-600 py-1 px-4">EDUCATION</h2>
                <ul className="list-disc pl-5">
                  {currentResumeDetails['education']?.map((e, _i) => (
                    <li className='text-[18px]' key={_i}>{e}</li>
                  ))}
                </ul>
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
