import { useState, useEffect } from "react";
import { Home, Wallet, Package, User } from "lucide-react";
import { Dashboard } from "./components/Dashboard";
import { Transactions } from "./components/Transactions";
import { Products } from "./components/Products";
import { Profile } from "./components/Profile";
import { Onboarding } from "./components/Onboarding";
import { Toaster } from "./components/ui/sonner";

// Tipe Tab disederhanakan untuk MVP
type TabType = "dashboard" | "transactions" | "products" | "profile";

export default function App() {
    const [activeTab, setActiveTab] = useState<TabType>("dashboard");
    const [showOnboarding, setShowOnboarding] = useState(true);

    useEffect(() => {
        // Check if user has seen onboarding
        const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
        if (hasSeenOnboarding) {
            setShowOnboarding(false);
        }
    }, []);

    const handleCompleteOnboarding = () => {
        localStorage.setItem("hasSeenOnboarding", "true");
        setShowOnboarding(false);
    };

    if (showOnboarding) {
        return <Onboarding onComplete={handleCompleteOnboarding} />;
    }

    // DEFINISI MENU MVP (3T Friendly)
    // Chat & Order dihilangkan karena butuh internet stabil/server
    const tabs = [
        { id: "dashboard" as TabType, label: "Beranda", icon: Home },
        { id: "transactions" as TabType, label: "Keuangan", icon: Wallet },
        { id: "products" as TabType, label: "Stok", icon: Package }, // Digunakan untuk manajemen stok offline
        { id: "profile" as TabType, label: "Akun", icon: User },
    ];

    return (
        <>
            <div className="flex flex-col h-screen bg-gray-50 max-w-md mx-auto shadow-2xl overflow-hidden">
                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto pb-20 scrollbar-hide">
                    {activeTab === "dashboard" && <Dashboard />}
                    {activeTab === "transactions" && <Transactions />}
                    {activeTab === "products" && <Products />}
                    {activeTab === "profile" && <Profile />}
                </div>

                {/* Bottom Navigation (MVP Scope) */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 max-w-md mx-auto z-50">
                    <div className="flex justify-around items-center h-16 px-2">
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

            {/* Toast Notification Container */}
            <Toaster position="top-center" richColors />
        </>
    );
}
