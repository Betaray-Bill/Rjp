import { Button } from '@/components/ui/button';
import { setIsDownload } from '@/features/resumeSlice';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import React, { Fragment, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';

function ResumeDownload() {

  const {currentResumeDetails, currentResumeName,downloadResume, downloadResumeName} = useSelector(state => state.resume)
  const resumeRef = useRef();
  const {user}  = useSelector(state => state.auth)
  const dispatch = useDispatch()


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
        pdf.save(`${user.name}-${currentResumeName}`);
      })
      .catch((error) => {
        console.error('Error generating PDF: ', error);
      });
};
  return (
    <Fragment>
      <div>
        <Button onClick={handleDownload}>DOwnload</Button>
      </div>
      <div ref={resumeRef} className='p-2 grid grid-cols-2 w-[80vw]'>
        <div className="resume-content">
          <h2 className='font-semibold'>Professional Summary</h2>
          {
            currentResumeDetails['professionalSummary']?.map((e, _i) => (
              <li className='text-[18px]' key={_i}>{e}</li>
            ))
          }
        </div>
        <div className="resume-content">
        <h2 className='font-semibold'>Technical Skills</h2>

          {
            currentResumeDetails['technicalSkills']?.map((e, _i) => (
              <li className='text-[18px]' key={_i}>{e}</li>
            ))
          }
        </div>
        <div className="resume-content">
        <h2 className='font-semibold'>Career History</h2>
          {
            currentResumeDetails['careerHistory']?.map((e, _i) => (
              <li className='text-[18px]' key={_i}>{e}</li>
            ))
          }
        </div>
        <div className="resume-content">
          <h2 className='font-semibold'>Certification</h2>
          {
            currentResumeDetails['certifications']?.map((e, _i) => (
              <li className='text-[18px]' key={_i}>{e}</li>
            ))
          }
        </div>
        <div className="resume-content">
        <h2 className='font-semibold'>Education</h2>

          {
            currentResumeDetails['education']?.map((e, _i) => (
              <li className='text-[18px]' key={_i}>{e}</li>
            ))
          }
        </div>
        <div className="resume-content">
        <h2 className='font-semibold'>Training Delivered</h2>

          {
            currentResumeDetails['trainingsDelivered']?.map((e, _i) => (
              <li className='text-[18px]' key={_i}>{e}</li>
            ))
          }
        </div>
        <div className="resume-content">
        <h2 className='font-semibold'>Clientele</h2>

          {
            currentResumeDetails['clientele']?.map((e, _i) => (
              <li className='text-[18px]' key={_i}>{e}</li>
            ))
          }
        </div>    
        <div className="resume-content">
        <h2 className='font-semibold'>Experience</h2>

          {
            currentResumeDetails['experience']?.map((e, _i) => (
              <li className='text-[18px]' key={_i}>{e}</li>
            ))
          }
        </div>    
         
         </div>
    </Fragment>
    // </div>
  )
}

export default ResumeDownload
