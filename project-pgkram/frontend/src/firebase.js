// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDy5v-FCp_fODw67J_BuC5Xjd8FS50Zx2Y",
    authDomain: "pgkram-analytics-test.firebaseapp.com",
    projectId: "pgkram-analytics-test",
    storageBucket: "pgkram-analytics-test.appspot.com",
    messagingSenderId: "324960931220",
    appId: "1:324960931220:web:2c30dfe555d33749511381",
    measurementId: "G-NW9B5SWSHT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);