// client/src/config/firebase.js

import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your Firebase configuration
const firebaseConfig = {
  // Replace with your actual Firebase config values
  apiKey: "AIzaSyC68PuZigWrYnX9YVn-LoidunIVDtTFnbk",
  authDomain: "civic-pulse-67313.firebaseapp.com",
  projectId: "civic-pulse-67313",
  // ❗️ THIS IS THE LINE TO FIX ❗️
  storageBucket: "civic-pulse-67313.appspot.com",
  messagingSenderId: "862712612343",
  appId: "1:862712612343:web:2a875d27ef2f47de5f5af2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage
export const storage = getStorage(app);

export default app;
