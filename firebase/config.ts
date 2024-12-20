import { initializeApp, getApps, getApp } from 'firebase/app';
import {FIREBASE_API_KEY, FIREBASE_APP_ID, FIREBASE_STORAGE_BUCKET} from "@env"
// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
import {getDownloadURL, ref, getStorage, uploadBytesResumable} from "firebase/storage";
import { UploadTask } from 'expo-file-system';

// console.log(FIREBASE_API_KEY)

// Initialize Firebase
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: 'project-id.firebaseapp.com',
  // databaseURL: 'https://project-id.firebaseio.com',
  projectId: 'project-id',
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

const uploadToFireBase = async (uri, name, onProgress) => {
  const fetchResponse = await fetch(uri);
  const theBlob = await fetchResponse.blob();
  console.log("theblob", theBlob);
  const imageRef = ref(getStorage(), `images/${name}`);

  const uploadTask = uploadBytesResumable(imageRef, theBlob);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress && onProgress(progress);
      },
      (error) => {
        reject(error);
      },
      async () => {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        resolve({ downloadUrl, metadata: uploadTask.snapshot.metadata });
      }
    );
  });
};


export {
  fbApp, fbStorage, uploadToFireBase
}

// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
