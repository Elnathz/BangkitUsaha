// FILE: src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

// --- GANTI DATA DI BAWAH INI DENGAN CONFIG DARI FIREBASE CONSOLE KAMU ---
const firebaseConfig = {
    apiKey: "AIzaSyB8pKj1Fsr-4GM4n2zSYu3GI794Q-2rSdE",
    authDomain: "umkm-1802b.firebaseapp.com",
    projectId: "umkm-1802b",
    storageBucket: "umkm-1802b.firebasestorage.app",
    messagingSenderId: "1083523484604",
    appId: "1:1083523484604:web:c91d43619b1dd6ba7af9b9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore Database
export const db = getFirestore(app);

// (Opsional) Aktifkan Offline Persistence agar data bisa dibaca saat tidak ada sinyal
// Ini kadang error di mode dev hot-reload, jadi kita bungkus try-catch
try {
    enableIndexedDbPersistence(db).catch((err) => {
        if (err.code == "failed-precondition") {
            console.log("Persistence failed: Multiple tabs open");
        } else if (err.code == "unimplemented") {
            console.log("Persistence not supported by browser");
        }
    });
} catch (e) {
    // Ignore error
}
