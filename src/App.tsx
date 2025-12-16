import { useState, useEffect } from "react";
import { Home, Store, ShoppingBag, Users, UserCircle } from "lucide-react"; // Gunakan icon yang relevan
import { Dashboard } from "./components/Dashboard";
import { MyStore } from "./components/MyStore"; // Component Baru
import { Products } from "./components/Products"; // Marketplace
import { Community } from "./components/Community";
import { Profile } from "./components/Profile";
import { Toaster } from "./components/ui/sonner";

// Import Chat agar bisa diakses dari mana saja (sebagai modal/overlay) jika diperlukan,
// tapi di sini kita taruh di menu dashboard atau profil untuk akses chat list.
// Untuk MVP, kita bisa masukkan akses Chat List di Dashboard.

type TabType =
    | "dashboard"
    | "marketplace"
    | "mystore"
    | "community"
    | "profile";

export default function App() {
    const [activeTab, setActiveTab] = useState<TabType>("dashboard");

    const tabs = [
        { id: "dashboard" as TabType, label: "Beranda", icon: Home },
        { id: "marketplace" as TabType, label: "Beli", icon: ShoppingBag }, // Cari Produk
        { id: "mystore" as TabType, label: "Stok", icon: Store }, // Jualan Saya
        { id: "community" as TabType, label: "Warga", icon: Users }, // Komunitas
        { id: "profile" as TabType, label: "Akun", icon: UserCircle },
    ];

    return (
        <>
            <div className="flex flex-col h-screen bg-gray-50 max-w-md mx-auto shadow-2xl overflow-hidden">
                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto pb-20 scrollbar-hide">
                    {activeTab === "dashboard" && <Dashboard />}
                    {activeTab === "marketplace" && <Products />}
                    {activeTab === "mystore" && <MyStore />}
                    {activeTab === "community" && <Community />}
                    {activeTab === "profile" && <Profile />}
                </div>

                {/* Bottom Navigation */}
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
                                            ? "text-blue-600"
                                            : "text-gray-400 hover:text-gray-600"
                                    }`}
                                >
                                    <Icon
                                        className={`w-5 h-5 ${
                                            isActive ? "fill-blue-600/10" : ""
                                        }`}
                                        strokeWidth={2}
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
