import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import HeroSection from './HeroSection';
import Services from './Services';
import Notifications from './Notifications';
import { Link } from 'react-router-dom';
import axios from 'axios';
import  {useDropzone}  from 'react-dropzone';

const HomePage = () => {
  const [data,setData]=useState(null);
  const [success,setSuccess]=useState(null);
  const [formData, setFormData] = useState({
    name: 'Viraaj',
    email: 'viraajpathariya@gmail.com',
  });
  const [isMobile, setIsMobile] = useState(false);
  
  //The below function is used to send data from react to flask
  const sendDataToFlask = async () => {
    try {
      const response = await axios.post('https://pgrkam-backend.onrender.com/submit-data', formData);

      console.log('Response from Flask:', response.data);
    } catch (error) {
      console.error('Error sending data to Flask:', error);
    }
  };
  
  //The below function is used to update any value :
  const [documentId, setDocumentId] = useState('-NlrFpvKRdKXCD1ZtqWn'); // ID of the document to update / delete 
  const [updatedData, setUpdatedData] = useState({
    name: 'VaaniP',
    email: 'vaanipathariya@gmail.com',
  });

  const updateDataInMongoDB = async () => {
    try {
  
      const response = await axios.put(`https://pgrkam-backend.onrender.com/update-data/${documentId}`, updatedData);

      console.log('Response from Flask:', response.data);
    } catch (error) {
      console.error('Error updating data in Flask:', error);
    }
  };
  
  //The below function is used to delete data in mongodb 
  const deleteDataFromMongoDB = async () => {
    try {
      const response = await axios.delete(`https://pgrkam-backend.onrender.com/delete-data/${documentId}`);

      console.log('Response from Flask:', response.data);
    } catch (error) {
      console.error('Error deleting data in Flask:', error);
    }
  };
  
  //To update age by one 
  const updateDataInMongoDBAge = async () => {
    try {
  
      const response = await axios.put(`https://pgrkam-backend.onrender.com/increment-count/${documentId}`, updatedData);

      console.log('Response from Flask:', response.data);
    } catch (error) {
      console.error('Error updating data in Flask:', error);
    }
  };
  
  //The below function is used to post and update the pdf document , video and image : 
  const [uploadedFile, setUploadedFile] = useState(null);

  const onDrop = (acceptedFiles) => {
    setUploadedFile(acceptedFiles[0]);
  };
  const { getRootProps, getInputProps } = useDropzone({ onDrop});
  const uploadFile = async () => {
    const formData = new FormData();
    formData.append('file', uploadedFile);

    try {
      const response = await axios.post('https://pgrkam-backend.onrender.com/upload-pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('File uploaded successfully',response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };
  
  // The below function is used to fetch data from mongodb and store that data in the "data variable"
  useEffect(() => {
    const fetchSuccessData = async () => {
      try {
        const response = await axios.get('https://pgrkam-backend.onrender.com/get-success');
        setSuccess(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchSuccessData();
    const IncrementFailure = async () => {
      try {
    
        const response = await axios.put(`https://pgrkam-backend.onrender.com/increment-failure`);
  
        console.log('Response from Flask:', response.data);
      } catch (error) {
        console.error('Error updating data in Flask:', error);
      }
    };
    const DecrementFailure = async () => {
      try {
    
        const response = await axios.put(`https://pgrkam-backend.onrender.com/decrement-failure`);
  
        console.log('Response from Flask:', response.data);
      } catch (error) {
        console.error('Error updating data in Flask:', error);
      }
    };
  }, []);
  console.log(success)
  
  return (
    <div className='min-h-screen'>
      {/* Marquee Bar */}
      <div className='bg-[#f28c28] py-2 text-sm font-bold text-black overflow-hidden'>
        <div className='animate-marquee whitespace-nowrap'>
          List of registered Recruiting Agents in Punjab - For sending abroad on work visa
        </div>
      </div>

      {/* Notification Bar */}
      <div className='bg-[#003d80] text-white text-center py-2.5 text-sm font-bold border-b-2 border-[#f28c28] animate-slideDown'>
        🔔 New job openings updated daily. Register now and never miss an opportunity!
      </div>

      <Navbar />
      <HeroSection/>
      
      <div className='flex '>
        <div className='w-3/5 m-auto '>
          <Services/>
        </div>
        <div className='w-1/5 m-auto'>
          <Notifications/>
        </div>
      </div>

      {/* Footer */}
      <footer className='pt-10 pb-5 mt-[60px] panel-translucent'>
        <div className='flex justify-between w-[85%] mx-auto flex-wrap'>
          <div className='mb-5'>
            <h3 className='mb-3 text-[#f28c28]'>Punjab Ghar Ghar Rozgar</h3>
            <p className='my-1 text-sm'>Your Gateway to Punjab Employment</p>
            <p className='my-1 text-sm'>Connecting Talent with Opportunities</p>
          </div>
          <div className='mb-5'>
            <h3 className='mb-3 text-[#f28c28]'>Quick Links</h3>
            <p className='my-1 text-sm cursor-pointer hover:text-[#f28c28]'>Home</p>
            <p className='my-1 text-sm cursor-pointer hover:text-[#f28c28]'>About Us</p>
            <p className='my-1 text-sm cursor-pointer hover:text-[#f28c28]'>Contact</p>
            <Link to='/analytics'>
              <p className='my-1 text-sm cursor-pointer hover:text-[#f28c28]'>Admin Login</p>
            </Link>
          </div>
          <div className='mb-5'>
            <h3 className='mb-3 text-[#f28c28]'>Contact</h3>
            <p className='my-1 text-sm'>Email: support@punjabnaukari.in</p>
            <p className='my-1 text-sm'>Phone: +91-9876543210</p>
            <p className='my-1 text-sm'>Chandigarh, Punjab, India</p>
          </div>
          <div className='mb-5'>
            <h3 className='mb-3 text-[#f28c28]'>Follow Us</h3>
            <p className='my-1 text-sm'>👍 Twitter 📸 Instagram ▶️ YouTube</p>
          </div>
        </div>
        <div className='text-center mt-5 pt-2.5 border-t border-[rgba(255,255,255,0.04)]'>
          © 2025 Punjab Ghar Ghar Rozgar — All Rights Reserved
        </div>
      </footer>
    </div>
  )
}

export default HomePage
