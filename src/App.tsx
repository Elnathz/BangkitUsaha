import { useState, useEffect } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // Tambahkan import Firestore
import { auth, db } from "./lib/firebase";
import { Home, Wallet, Package, User } from "lucide-react";
import { Dashboard } from "./components/home/Dashboard";
import { Transactions } from "./components/finance/Transactions";
import { Products } from "./components/inventory/Products";
import { Profile } from "./components/account/Profile";
import { Login } from "./components/account/login";
import { BusinessSetup } from "./components/account/BusinessSetup"; // Import komponen baru
import { Toaster } from "./components/ui/sonner";
import { Loader2 } from "lucide-react";

type TabType = "dashboard" | "transactions" | "products" | "profile";

export default function App() {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [isRegistered, setIsRegistered] = useState<boolean | null>(null); // Status apakah sudah isi form
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabType>("dashboard");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                // User Login -> Cek Data di Firestore
                setUser(currentUser);
                try {
                    const userDocRef = doc(db, "users", currentUser.uid);
                    const userDoc = await getDoc(userDocRef);

                    if (userDoc.exists() && userDoc.data().isSetupComplete) {
                        setIsRegistered(true); // User lama
                    } else {
                        setIsRegistered(false); // User baru (belum isi data)
                    }
                } catch (error) {
                    console.error("Gagal cek data user:", error);
                    // Fallback jika error (misal offline), anggap belum register untuk keamanan
                    setIsRegistered(false);
                }
            } else {
                // User Logout
                setUser(null);
                setIsRegistered(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Callback saat user selesai isi form BusinessSetup
    const handleRegistrationComplete = () => {
        setIsRegistered(true);
    };

    // --- LOGIKA TAMPILAN ---

    // 1. Loading Awal (Cek Login & Cek Database)
    if (loading) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
                <p className="text-gray-500 text-sm">Memuat data usaha...</p>
            </div>
        );
    }

    // 2. Belum Login -> Tampilkan Login Page
    if (!user) {
        return (
            <>
                <Login />
                <Toaster position="top-center" richColors />
            </>
        );
    }

    // 3. Sudah Login TAPI Belum Isi Data -> Tampilkan Form Data Usaha
    if (isRegistered === false) {
        return (
            <>
                <BusinessSetup onComplete={handleRegistrationComplete} />
                <Toaster position="top-center" richColors />
            </>
        );
    }

    // 4. Sudah Login DAN Sudah Isi Data -> Tampilkan Dashboard (Aplikasi Utama)
    const tabs = [
        { id: "dashboard" as TabType, label: "Beranda", icon: Home },
        { id: "transactions" as TabType, label: "Keuangan", icon: Wallet },
        { id: "products" as TabType, label: "Stok", icon: Package },
        { id: "profile" as TabType, label: "Akun", icon: User },
    ];

    return (
        <>
            <div className="flex flex-col h-screen bg-gray-50 max-w-md mx-auto shadow-2xl overflow-hidden">
                <div className="flex-1 overflow-y-auto pb-20 scrollbar-hide">
                    {/* Kirim data user ke komponen jika perlu */}
                    {activeTab === "dashboard" && <Dashboard />}
                    {activeTab === "transactions" && <Transactions />}
                    {activeTab === "products" && <Products />}
                    {activeTab === "profile" && <Profile />}
                </div>

                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 max-w-md mx-auto z-50">
                    <div className="flex justify-around items-center h-16 px-2">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 ${isActive
                                            ? "text-blue-600 scale-105"
                                            : "text-gray-400 hover:text-gray-600"
                                        }`}
                                >
                                    <Icon className={`w-6 h-6 ${isActive ? "fill-blue-600/10" : ""}`} />
                                    <span className={`text-[10px] mt-1 font-medium ${isActive ? "opacity-100" : "opacity-80"}`}>
                                        {tab.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
            <Toaster position="top-center" richColors />
        </>
    );
}