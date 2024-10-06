import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Import Firestore

const firebaseConfig = {
    apiKey: "AIzaSyAArQ-mf7ScVGT2Uybv2-3mFE9MMMzCDzQ",
    authDomain: "bookify-29a0a.firebaseapp.com",
    projectId: "bookify-29a0a",
    storageBucket: "bookify-29a0a.appspot.com",
    messagingSenderId: "642193646842",
    appId: "1:642193646842:web:a7440212053f15e3681543",
    measurementId: "G-568Z09J0XQ"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); // Initialize Firestore and export it
export { app };
export default firebaseConfig;
