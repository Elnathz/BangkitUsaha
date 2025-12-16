import { useState, useEffect } from "react";
import { User, Save, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";

// Firebase
import { db } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { getCurrentUser, updateUserProfile } from "../lib/user";

export function Profile() {
    const [user, setUser] = useState(getCurrentUser());
    const [name, setName] = useState(user.name);
    const [role, setRole] = useState(user.role);
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!name.trim()) return;
        setLoading(true);

        try {
            // 1. Simpan ke LocalStorage (HP ini)
            const updatedUser = updateUserProfile(name, role);
            setUser(updatedUser);

            // 2. Simpan ke Firebase (Database User)
            // Agar user ini terdaftar resmi dan bisa dicari sistem
            await setDoc(doc(db, "users", updatedUser.id), {
                name: updatedUser.name,
                role: updatedUser.role,
                avatar: updatedUser.avatar,
                lastActive: new Date().toISOString(),
            });

            toast.success("Profil berhasil disimpan!");
        } catch (error) {
            console.error(error);
            toast.error("Gagal menyimpan ke server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-24">
            <div className="bg-blue-600 p-8 text-white text-center rounded-b-3xl mb-6">
                <div className="relative inline-block">
                    <Avatar className="w-24 h-24 border-4 border-white shadow-lg mb-3">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                </div>
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-blue-100 opacity-90 capitalize">
                    {user.role}
                </p>
                <p className="text-xs text-blue-200 mt-2 font-mono">
                    ID: {user.id}
                </p>
            </div>

            <div className="px-4">
                <Card className="p-4 space-y-4">
                    <h3 className="font-semibold flex items-center gap-2 border-b pb-2 mb-2">
                        <User className="w-5 h-5 text-blue-600" /> Edit Profil
                    </h3>

                    <div>
                        <Label>Nama Lengkap</Label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nama Toko / Nama Anda"
                        />
                    </div>

                    <div>
                        <Label>Jenis Usaha</Label>
                        <Input
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            placeholder="Contoh: Petani / Pengepul / Kerajinan"
                        />
                    </div>

                    <Button
                        onClick={handleSave}
                        disabled={loading}
                        className="w-full bg-blue-600"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {loading ? "Menyimpan..." : "Simpan Perubahan"}
                    </Button>
                </Card>

                <div className="mt-6 text-center text-xs text-gray-400">
                    <p>Bangkit Usaha v1.0.0</p>
                    <p>Mendukung Ekonomi Daerah 3T</p>
                </div>
            </div>
        </div>
    );
}
