import { setIsDownload } from '@/features/resumeSlice';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';

function Suma() {

  const {currentResumeDetails, currentResumeName,downloadResume, downloadResumeName} = useSelector(state => state.resume)
  const resumeRef = useRef();
  const {user}  = useSelector(state => state.auth)
  const dispatch = useDispatch()


  useEffect(() => {
    console.log("Dowload obj")
    if (downloadResume && downloadResumeName === currentResumeName) {
        handleDownload()
        console.log("yes")
        dispatch(setIsDownload({
            bool: false, name: ''
        }))
    }
  }, [downloadResume, currentResumeName])

const handleDownload = () => {
    const element = resumeRef.current;

    html2canvas(element, { scale: 2 })
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210; // Width of A4 page in mm
        const pageHeight = '100vh '; // Height of A4 page in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

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
    <div ref={resumeRef} className=''>
       <div className="resume-header">Anandhi K</div>
        
        <div className="section-title">Profile Summary</div>
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
    // </div>
  )
}

export default Suma
