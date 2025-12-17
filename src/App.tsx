// FILE: src/App.tsx
import { useState, useEffect } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./lib/firebase";
import { Home, Wallet, Package, User, ShoppingCart, Users } from "lucide-react";

// Import Komponen Halaman
import { Dashboard } from "./components/home/Dashboard";
import { Transactions } from "./components/finance/Transactions";
import { MyStore } from "./components/MyStore"; // Inventory Toko Sendiri
import { Products as Marketplace } from "./components/inventory/Products"; // Marketplace (Barang Orang Lain)
import { Orders } from "./components/Orders"; // Manajemen Pesanan
import { Community } from "./components/Community"; // Komunitas
import { Profile } from "./components/account/Profile";
import { Login } from "./components/account/login";
import { BusinessSetup } from "./components/account/BusinessSetup";

// Import UI
import { Toaster } from "./components/ui/sonner";
import { Loader2 } from "lucide-react";

// Definisi Tipe Tab yang Konsisten
export type TabType =
    | "dashboard"
    | "transactions"
    | "mystore"
    | "orders"
    | "community"
    | "profile"
    | "marketplace";

export default function App() {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [isRegistered, setIsRegistered] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabType>("dashboard");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                try {
                    const userDocRef = doc(db, "users", currentUser.uid);
                    const userDoc = await getDoc(userDocRef);
                    if (userDoc.exists() && userDoc.data().isSetupComplete) {
                        setIsRegistered(true);
                    } else {
                        setIsRegistered(false);
                    }
                } catch (error) {
                    console.error("Gagal cek data user:", error);
                    setIsRegistered(false);
                }
            } else {
                setUser(null);
                setIsRegistered(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleRegistrationComplete = () => {
        setIsRegistered(true);
    };

    // Fungsi navigasi yang dilempar ke komponen anak (misal: Dashboard)
    const handleNavigate = (tab: TabType) => {
        setActiveTab(tab);
    };

    // --- RENDER LOGIC ---

    if (loading) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
                <p className="text-gray-500 text-sm">Memuat data usaha...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <>
                <Login />
                <Toaster position="top-center" richColors />
            </>
        );
    }

    if (isRegistered === false) {
        return (
            <>
                <BusinessSetup onComplete={handleRegistrationComplete} />
                <Toaster position="top-center" richColors />
            </>
        );
    }

    // Definisi Menu Bawah (Bottom Navigation)
    // Saya sesuaikan agar mencakup fitur vital: Beranda, Keuangan, Stok, Pesanan, Akun
    const tabs = [
        { id: "dashboard" as TabType, label: "Beranda", icon: Home },
        { id: "transactions" as TabType, label: "Keuangan", icon: Wallet },
        { id: "mystore" as TabType, label: "Stok", icon: Package }, // Mengarah ke MyStore (Inventory)
        { id: "orders" as TabType, label: "Pesanan", icon: ShoppingCart }, // Mengarah ke Orders
        { id: "profile" as TabType, label: "Akun", icon: User },
    ];

    return (
        <>
            <div className="flex flex-col h-screen bg-gray-50 max-w-md mx-auto shadow-2xl overflow-hidden">
                {/* Area Konten Utama */}
                <div className="flex-1 overflow-y-auto pb-20 scrollbar-hide">
                    {activeTab === "dashboard" && (
                        <Dashboard onNavigate={handleNavigate} />
                    )}
                    {activeTab === "transactions" && <Transactions />}
                    {activeTab === "mystore" && <MyStore />}
                    {activeTab === "orders" && <Orders />}
                    {activeTab === "profile" && <Profile />}

                    {/* Tab Tambahan (Tidak ada di menu bawah, tapi bisa diakses dari Dashboard) */}
                    {activeTab === "community" && <Community />}
                    {activeTab === "marketplace" && <Marketplace />}
                </div>

                {/* Bottom Navigation Bar */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 max-w-md mx-auto z-50">
                    <div className="flex justify-around items-center h-16 px-1">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 ${
                                        isActive
                                            ? "text-blue-600 scale-105"
                                            : "text-gray-400 hover:text-gray-600"
                                    }`}
                                >
                                    <Icon
                                        className={`w-6 h-6 ${
                                            isActive ? "fill-blue-600/10" : ""
                                        }`}
                                    />
                                    <span
                                        className={`text-[10px] mt-1 font-medium ${
                                            isActive
                                                ? "opacity-100"
                                                : "opacity-80"
                                        }`}
                                    >
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
