import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
// Tambahkan GoogleAuthProvider
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyB8pKj1Fsr-4GM4n2zSYu3GI794Q-2rSdE",
    authDomain: "umkm-1802b.firebaseapp.com",
    projectId: "umkm-1802b",
    storageBucket: "umkm-1802b.firebasestorage.app",
    messagingSenderId: "1083523484604",
    appId: "1:1083523484604:web:c91d43619b1dd6ba7af9b9",
};

const app = initializeApp(firebaseConfig);

// Exports
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
