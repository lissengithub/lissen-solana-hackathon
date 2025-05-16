import { FirebaseOptions, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const config = process.env.NEXT_PUBLIC_FIREBASE_CONFIG;

if (!config) {
  throw new Error("Missing firebase config");
}

const firebaseConfig = JSON.parse(config) as FirebaseOptions;

// Initialize Firebase
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

export { app, auth };
