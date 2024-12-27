import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import Constants from "expo-constants";
// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCvr3H-A-UuHISRJ8ARd3b3Ch91s4BX5qw",
  authDomain: "project-1605870131167007737.firebaseapp.com",
  projectId: "project-1605870131167007737",
  storageBucket: "project-1605870131167007737.firebasestorage.app",
  messagingSenderId: "456621479803",
  appId: "1:456621479803:web:418c5c79e1e3aecd754fde"
  //   @deprecated is deprecated Constants.manifest
};
// initialize firebase
initializeApp(firebaseConfig);
export const auth = getAuth();
export const database = getFirestore();
