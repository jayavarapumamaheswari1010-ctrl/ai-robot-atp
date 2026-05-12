// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBact-H9gZxCTrkIJV4cwl65jgxVyn2qG4",
  authDomain: "ai-2fir.firebaseapp.com",
  projectId: "ai-2fir",
  storageBucket: "ai-2fir.firebasestorage.app",
  messagingSenderId: "722207499717",
  appId: "1:722207499717:web:dd6df06632016602b417ac",
  measurementId: "G-KG845T1M1W"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
