import { Route, Routes, BrowserRouter as Router } from 'react-router-dom'
import './App.css'
import HomePage from './pages/homePage/HomePage'
import User from './pages/userSide/User'
import Analytics from './pages/Analytics'
import ApplyJob from './pages/userSide/ApplyJob'
import Company from './pages/userSide/Company'
import JobDetails from './components/JobDetails'
import RetentionRate from './components/analytics/RetentionRate'
import TrafficSource from './components/analytics/TrafficSource'
import ActiveUser from './components/analytics/ActiveUser'
import UserDemo from './components/analytics/UserDemo'
import DeviceType from './components/analytics/DeviceType'
import SuccessFailure from './components/analytics/SuccessFailure'
import JobAvail from './components/analytics/JobAvail'
import UserInteraction from './components/analytics/UserInteraction'
import UserDemographics from './components/analytics/UserDemographics'
import ChatBot from './components/ChatBot'
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { logEvent } from 'firebase/analytics';
import { useEffect } from 'react'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBtN5KQkpsXzN1zqvQVt1djUKLrsP_uDP8",
  authDomain: "pgrkam-117c0.firebaseapp.com",
  databaseURL: "https://pgrkam-117c0-default-rtdb.firebaseio.com",
  projectId: "pgrkam-117c0",
  storageBucket: "pgrkam-117c0.appspot.com",
  messagingSenderId: "980934921200",
  appId: "1:980934921200:web:126d7d851381bc022b2b35",
  measurementId: "G-MFTHEZYJ0C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

function App() {

  useEffect(() => {
    console.log(analytics); // Check if 'logEvent' is present
    logEvent(analytics, 'component_mount', {
      componentName: 'App', // Replace with your actual component name
    });
  }, []);

  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/user' element={<User />} />
          <Route path='/analytics' element={<Analytics />} />
          <Route path='/apply' element={<ApplyJob />} />
          <Route path='/apply/:id' element={<JobDetails />} />
          <Route path='/company' element={<Company />} />
          <Route path='/analytics/retention-rate' element={<RetentionRate />} />
          <Route path='/analytics/traffic-source' element={<TrafficSource />} />
          <Route path='/analytics/active-user' element={<ActiveUser />} />
          <Route path='/analytics/user-demo' element={<UserDemographics/>} />
          <Route path='/analytics/device-type' element={<DeviceType />} />
          <Route path='/analytics/success-failure' element={<SuccessFailure />} />
          <Route path='/analytics/job-avail' element={<JobAvail />} />
          <Route path='/analytics/user-interaction' element={<UserInteraction />} />

        </Routes>
        
        {/* AI Chatbot - Available on all pages */}
        <ChatBot />
      </Router>
    </div>
  )
}

export default App
