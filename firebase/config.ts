import { initializeApp, getApps, getApp } from 'firebase/app';
import {FIREBASE_API_KEY, FIREBASE_APP_ID, FIREBASE_STORAGE_BUCKET} from "@env"
// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
import {getStorage} from "firebase/storage";

console.log(FIREBASE_API_KEY)

// Initialize Firebase
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  // authDomain: 'project-id.firebaseapp.com',
  // databaseURL: 'https://project-id.firebaseio.com',
  // projectId: 'project-id',
  storageBucket: FIREBASE_STORAGE_BUCKET,
  // messagingSenderId: 'sender-id',
  appId: FIREBASE_APP_ID,
  measurementId: 'G-measurement-id',
};

if (getApps().length === 0) {
  initializeApp(firebaseConfig);
}

const fbApp = getApp();
const fbStorage = getStorage();
export {
  fbApp, fbStorage
}

// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
