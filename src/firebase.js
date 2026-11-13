import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAMyeHx6dG8VutR2D93bet6DcUzt_6TSGg",
  authDomain: "clon-x-e8df5.firebaseapp.com",
  projectId: "clon-x-e8df5",
  storageBucket: "clon-x-e8df5.firebasestorage.app",
  messagingSenderId: "425958025294",
  appId: "1:425958025294:web:ca13790b37c8a84488fb1f",
  measurementId: "G-M0W6RWEQZ5"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app;