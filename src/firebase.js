// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCigQdm1uXhQO6uNmYVqW5Qejk32aW7-yU",
  authDomain: "expense-tracker-d9979.firebaseapp.com",
  databaseURL: "https://expense-tracker-d9979-default-rtdb.firebaseio.com/",
  projectId: "expense-tracker-d9979",
  storageBucket: "expense-tracker-d9979.appspot.com",
  messagingSenderId: "1019895684202",
  appId: "1:1019895684202:web:6aae5bff39c61b08ce7e13",
  measurementId: "G-E4YEW8928J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { auth }; // Export the 'auth' object

export default app; // Optionally, you can export the 'app' object as well