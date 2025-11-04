import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCXtf_VPl9AzbM31JNTdCEfuNhbb3JyzhM",
  authDomain: "starry-start-dd62d.firebaseapp.com",
  projectId: "starry-start-dd62d",
  storageBucket: "starry-start-dd62d.firebasestorage.app",
  messagingSenderId: "725080216783",
  appId: "1:725080216783:web:9a57204fc98969219e93ba",
  measurementId: "G-PW314ZFG3H",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
