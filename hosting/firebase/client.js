// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDOFekZd4vQ3J9o53bciSzO2rpmuT-p4Vw',
  authDomain: 'blidd-experiments.firebaseapp.com',
  projectId: 'blidd-experiments',
  storageBucket: 'blidd-experiments.appspot.com',
  messagingSenderId: '319766234289',
  appId: '1:319766234289:web:318a6b73ce925a813bce90',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

let db;

if (process.env.NODE_ENV === 'development') {
  db = getFirestore();
  connectFirestoreEmulator(db, 'localhost', 8080);
} else {
  db = getFirestore(app);
}

export { db };
