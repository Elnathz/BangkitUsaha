import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// 1. Tambahkan import Storage
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyB8pKj1Fsr-4GM4n2zSYu3GI794Q-2rSdE",
    authDomain: "umkm-1802b.firebaseapp.com",
    projectId: "umkm-1802b",
    storageBucket: "umkm-1802b.firebasestorage.app",
    messagingSenderId: "1083523484604",
    appId: "1:1083523484604:web:c91d43619b1dd6ba7af9b9"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
// 2. Export storage
export const storage = getStorage(app);

try {
    enableIndexedDbPersistence(db).catch((err) => {
        console.log("Persistence error", err);
    });
} catch (e) {
    // Ignore
}