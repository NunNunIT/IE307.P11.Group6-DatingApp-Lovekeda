import { getApps, initializeApp } from "firebase-admin/app";
import { FIREBASE_CONFIG } from "@/constants/firebase";

getApps()?.[0] ?? initializeApp(FIREBASE_CONFIG);