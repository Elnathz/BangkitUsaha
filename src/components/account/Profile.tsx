import { useState, useEffect } from "react";
import {
    User as UserIcon,
    Settings,
    LogOut,
    HelpCircle,
    ChevronRight,
    Shield,
    CreditCard,
} from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebase"; // Pastikan path ini sesuai
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"; // Jika error, ganti dengan div biasa (lihat opsi di bawah)

export function Profile() {
    const [user, setUser] = useState(auth.currentUser);

    // Pantau perubahan status login
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast.success("Berhasil keluar 👋");
            // App.tsx akan otomatis mendeteksi user null dan pindah ke halaman login
        } catch (error) {
            console.error("Logout Error:", error);
            toast.error("Gagal keluar, coba lagi.");
        }
    };

    if (!user) {
        return <div className="p-8 text-center">Memuat data pengguna...</div>;
    }

    const menuItems = [
        {
            label: "Akun Saya",
            items: [
                {
                    icon: UserIcon,
                    label: "Edit Profil",
                    onClick: () =>
                        toast.info("Fitur Edit Profil segera hadir!"),
                },
                {
                    icon: CreditCard,
                    label: "Rekening Bank",
                    onClick: () => toast.info("Fitur Rekening segera hadir!"),
                },
            ],
        },
        {
            label: "Keamanan & Bantuan",
            items: [
                {
                    icon: Shield,
                    label: "Keamanan Akun",
                    onClick: () => toast.info("Aman terkendali!"),
                },
                {
                    icon: HelpCircle,
                    label: "Pusat Bantuan",
                    onClick: () =>
                        window.open("https://wa.me/628123456789", "_blank"),
                },
            ],
        },
    ];

    return (
        <div className="bg-gray-50 min-h-screen pb-24">
            {/* Header Profile */}
            <div className="bg-white px-6 pt-10 pb-8 shadow-sm rounded-b-3xl mb-6">
                <div className="flex flex-col items-center text-center">
                    {/* Avatar Circle */}
                    <div className="h-24 w-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold mb-4 shadow-inner border-4 border-white">
                        {user.photoURL ? (
                            <img
                                src={user.photoURL}
                                alt="Profile"
                                className="h-full w-full rounded-full object-cover"
                            />
                        ) : (
                            <span>
                                {user.displayName
                                    ? user.displayName.charAt(0).toUpperCase()
                                    : "U"}
                            </span>
                        )}
                    </div>

                    <h1 className="text-xl font-bold text-gray-800">
                        {user.displayName || "Pengguna Bangkit"}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">{user.email}</p>
                    <div className="mt-4 px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium inline-block">
                        Terverifikasi
                    </div>
                </div>
            </div>

            {/* Menu Sections */}
            <div className="px-4 space-y-6">
                {menuItems.map((section, idx) => (
                    <div key={idx}>
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 ml-2">
                            {section.label}
                        </h3>
                        <Card className="overflow-hidden border-none shadow-sm">
                            {section.items.map((item, itemIdx) => {
                                const Icon = item.icon;
                                return (
                                    <div key={itemIdx}>
                                        <button
                                            onClick={item.onClick}
                                            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                                    <Icon className="w-5 h-5" />
                                                </div>
                                                <span className="text-sm font-medium text-gray-700">
                                                    {item.label}
                                                </span>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-gray-400" />
                                        </button>
                                        {/* Divider antar item, kecuali item terakhir */}
                                        {itemIdx < section.items.length - 1 && (
                                            <div className="h-[1px] bg-gray-100 mx-4" />
                                        )}
                                    </div>
                                );
                            })}
                        </Card>
                    </div>
                ))}

                {/* Tombol Logout Terpisah */}
                <div className="pt-4">
                    <Button
                        variant="destructive"
                        className="w-full h-12 rounded-xl shadow-sm flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-100"
                        onClick={handleLogout}
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Keluar Aplikasi</span>
                    </Button>
                    <p className="text-center text-xs text-gray-400 mt-6">
                        Versi Aplikasi 1.0.0 (Beta)
                    </p>
                </div>
            </div>
        </div>
    );
}
