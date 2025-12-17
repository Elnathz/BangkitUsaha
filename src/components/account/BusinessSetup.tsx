import { useState } from "react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { toast } from "sonner";
import { Loader2, Store, User } from "lucide-react";

interface BusinessSetupProps {
  onComplete: () => void; // Fungsi callback agar App.tsx tahu proses selesai
}

export function BusinessSetup({ onComplete }: BusinessSetupProps) {
  const [storeName, setStoreName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!storeName || !ownerName) {
      toast.error("Nama Toko dan Pemilik wajib diisi");
      return;
    }

    if (!auth.currentUser) return;

    setLoading(true);
    try {
      // Simpan data profil usaha ke Firestore berdasarkan UID user
      await setDoc(doc(db, "users", auth.currentUser.uid), {
        uid: auth.currentUser.uid,
        email: auth.currentUser.email,
        storeName: storeName,
        ownerName: ownerName,
        phoneNumber: phone || auth.currentUser.phoneNumber || "",
        createdAt: serverTimestamp(),
        isSetupComplete: true // Penanda bahwa user ini sudah isi data
      });

      toast.success("Profil usaha berhasil dibuat!");
      onComplete(); // Beritahu App.tsx untuk pindah ke Dashboard
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Gagal menyimpan data. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-xl border-t-4 border-green-600">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Halo, Wirausahawan Baru!</CardTitle>
          <CardDescription>
            Lengkapi data usaha Anda agar kami bisa menyiapkan pembukuan yang kosong dan rapi untuk Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nama Usaha / Toko</label>
              <div className="relative">
                <Store className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Contoh: Keripik Pisang Bu Nanik"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="pl-9"
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Nama Pemilik</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Nama Lengkap Anda"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="pl-9"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Nomor WhatsApp (Opsional)</label>
              <Input
                type="tel"
                placeholder="0812..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={loading}
              />
            </div>

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 mt-4" disabled={loading}>
              {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyiapkan Toko...
                  </>
              ) : "Mulai Usaha Sekarang"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}