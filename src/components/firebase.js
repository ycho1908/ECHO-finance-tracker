// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDOQ50yg0IiiM4sO9amh-dkNPw2nW5ogGE",
  authDomain: "project-1-735a0.firebaseapp.com",
  projectId: "project-1-735a0",
  storageBucket: "project-1-735a0.appspot.com",
  messagingSenderId: "46804275530",
  appId: "1:46804275530:web:a38cce266b8bcbd8d1f1b3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth=getAuth();
export const db=getFirestore(app);
export default app;