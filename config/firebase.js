import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCvr3H-A-UuHISRJ8ARd3b3Ch91s4BX5qw",
  authDomain: "project-1605870131167007737.firebaseapp.com",
  projectId: "project-1605870131167007737",
  storageBucket: "project-1605870131167007737.firebasestorage.app",
  messagingSenderId: "456621479803",
  appId: "1:456621479803:web:418c5c79e1e3aecd754fde",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Firestore
export const database = getFirestore(app);
