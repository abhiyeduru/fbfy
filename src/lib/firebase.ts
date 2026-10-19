import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBaxIfZYU1Zxc55YhVSC00Y3Nb24dRIY1A",
  authDomain: "fbfy-eafdf.firebaseapp.com",
  projectId: "fbfy-eafdf",
  storageBucket: "fbfy-eafdf.firebasestorage.app",
  messagingSenderId: "953836533954",
  appId: "1:953836533954:web:79c484ad6f4b92b780a35b",
  measurementId: "G-V32L65S6R4",
};

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
