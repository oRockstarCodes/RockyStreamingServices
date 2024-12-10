import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Paste your firebaseConfig from Firebase Console here
const firebaseConfig = {
    apiKey: "AIzaSyAe1deVHoEvaqZ0UaC1st-3exEXEERJuMQ",
    authDomain: "summative-81dad.firebaseapp.com",
    projectId: "summative-81dad",
    storageBucket: "summative-81dad.firebasestorage.app",
    messagingSenderId: "792858171919",
    appId: "1:792858171919:web:60b3ff333ca70ab254617a"
};

const config = initializeApp(firebaseConfig)
const auth = getAuth(config);
const firestore = getFirestore(config);

export { auth, firestore };