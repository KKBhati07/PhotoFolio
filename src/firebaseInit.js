// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC3QJY95fuYg_-Pb1Ar5EvqRb1G7p8grtQ",
  authDomain: "photofolio-f106e.firebaseapp.com",
  projectId: "photofolio-f106e",
  storageBucket: "photofolio-f106e.appspot.com",
  messagingSenderId: "561953977927",
  appId: "1:561953977927:web:56bffd8b95d0e921606362"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//initialize firestore service
export default getFirestore(app);