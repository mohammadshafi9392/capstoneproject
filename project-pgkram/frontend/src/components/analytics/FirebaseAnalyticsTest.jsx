import React, { useEffect } from 'react';
import { logEvent } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics'; // Import necessary functions directly

const firebaseConfig = {
  apiKey: "AIzaSyDy5v-FCp_fODw67J_BuC5Xjd8FS50Zx2Y",
  authDomain: "pgkram-analytics-test.firebaseapp.com",
  projectId: "pgkram-analytics-test",
  storageBucket: "pgkram-analytics-test.appspot.com",
  messagingSenderId: "324960931220",
  appId: "1:324960931220:web:2c30dfe555d33749511381",
  measurementId: "G-NW9B5SWSHT"
};



const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const FirebaseAnalyticsTest = () => {
  useEffect(() => {
    console.log(analytics); // Check if 'logEvent' is present
    logEvent(analytics, 'component_mount', {
      componentName: 'FirebaseAnalyticsTest', // Replace with your actual component name
    });
  }, []);

  console.log('Rendering FirebaseAnalyticsTest component...');
  return <div>FirebaseAnalyticsTest</div>;
};

export default FirebaseAnalyticsTest;
