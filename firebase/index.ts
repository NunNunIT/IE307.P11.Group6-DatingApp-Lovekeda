import { initializeApp, getApps, getApp } from 'firebase/app';
import { FIREBASE_API_KEY, FIREBASE_APP_ID, FIREBASE_STORAGE_BUCKET, FIREBASE_PROJECT_ID, FIREBASE_AUTH_DOMAIN } from "@env"
import { getStorage } from "firebase/storage";
export * from './upload-files';

// Initialize Firebase
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  // databaseURL: 'https://project-id.firebaseio.com',
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  // messagingSenderId: 'sender-id',
  appId: FIREBASE_APP_ID,
  // measurementId: 'G-measurement-id',
};

if (getApps().length === 0) {
  initializeApp(firebaseConfig);
}

const fbApp = getApp();
const fbStorage = getStorage();

export { fbApp, fbStorage }
