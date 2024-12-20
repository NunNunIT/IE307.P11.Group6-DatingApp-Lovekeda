import { initializeApp, getApps, getApp } from 'firebase/app';
import { getStorage } from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  // authDomain: 'project-id.firebaseapp.com',
  // databaseURL: 'https://project-id.firebaseio.com',
  // projectId: 'project-id',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  // messagingSenderId: 'sender-id',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
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
