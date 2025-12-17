import { signOut, updateProfile } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../../lib/firebase";
import { useState, useEffect, useRef } from 'react';
import {
  Store,
  MapPin,
  Phone,
  Mail,
  Clock,
  Edit2,
  Camera,
  Star,
  Award,
  Settings,
  LogOut,
  ChevronRight,
  User,
  Loader2,
  Save,
  X
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Input } from '../ui/input';
import { toast } from 'sonner';

// Daftar Hari untuk Checkbox
const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

export function Profile() {
  const [businessProfile, setBusinessProfile] = useState({
    name: 'Memuat...',
    owner: '',
    category: 'Belum ada kategori',
    description: '',
    address: '',
    phone: '',
    email: '',
    openingHours: '',
    established: '',
    rating: 0,
    totalReviews: 0,
    totalSales: 0,
    responseRate: 0,
    image: '',
  });

  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(businessProfile);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- STATE KHUSUS JADWAL ---
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [openTime, setOpenTime] = useState("08:00");
  const [closeTime, setCloseTime] = useState("17:00");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            const loadedData = {
              name: data.storeName || user.displayName || "Toko Saya",
              owner: data.ownerName || user.displayName || "Pemilik",
              category: data.category || "Umum",
              description: data.description || "",
              address: data.address || "",
              phone: data.phoneNumber || data.phone || "",
              email: data.email || user.email || "",
              openingHours: data.openingHours || "",
              established: data.established || "",
              rating: data.rating || 0,
              totalReviews: data.totalReviews || 0,
              totalSales: data.totalSales || 0,
              responseRate: data.responseRate || 0,
              image: data.image || user.photoURL || ""
            };
            setBusinessProfile(prev => ({ ...prev, ...loadedData }));
            setFormData(prev => ({ ...prev, ...loadedData }));
          } else {
            const newData = {
              name: user.displayName || "Toko Baru",
              owner: user.displayName || "Pemilik",
              email: user.email || ""
            };
            setBusinessProfile(prev => ({ ...prev, ...newData }));
            setFormData(prev => ({ ...prev, ...newData }));
          }
        } catch (error) {
          console.error("Error fetching store data:", error);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // --- LOGIC PARSING JADWAL SAAT EDIT ---
  // Fungsi ini mencoba membaca format "Senin, Selasa: 08:00 - 17:00" agar checkbox terisi otomatis
  const parseSchedule = (scheduleString: string) => {
    if (!scheduleString) return;

    try {
      const parts = scheduleString.split(': '); // Pisahkan Hari dan Jam
      if (parts.length === 2) {
        const daysPart = parts[0].split(', '); // Pisahkan nama-nama hari
        const timesPart = parts[1].split(' - '); // Pisahkan jam buka - tutup

        // Validasi sederhana apakah hari yang ada valid
        const validDays = daysPart.filter(d => DAYS.includes(d));
        if (validDays.length > 0) setSelectedDays(validDays);

        if (timesPart.length === 2) {
          setOpenTime(timesPart[0]);
          setCloseTime(timesPart[1]);
        }
      }
    } catch (e) {
      // Jika format beda, biarkan default
      console.log("Format jadwal manual, reset ke default picker");
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran foto maksimal 2MB");
      return;
    }
    if (!auth.currentUser) return;

    setUploading(true);
    const toastId = toast.loading("Mengunggah foto...");

    try {
      const storageRef = ref(storage, `profile_photos/${auth.currentUser.uid}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userDocRef, { image: downloadURL });
      await updateProfile(auth.currentUser, { photoURL: downloadURL });
      setBusinessProfile(prev => ({ ...prev, image: downloadURL }));
      toast.success("Foto profil berhasil diperbarui!", { id: toastId });
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Gagal mengunggah foto.", { id: toastId });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const toggleEdit = () => {
    if (!isEditing) {
      setFormData(businessProfile);
      // Saat masuk mode edit, coba baca jadwal yang sudah ada
      parseSchedule(businessProfile.openingHours);
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- LOGIC BUILDER JADWAL (CHECKBOX & TIME) ---
  const handleDayToggle = (day: string) => {
    const newDays = selectedDays.includes(day)
      ? selectedDays.filter(d => d !== day)
      : [...selectedDays, day];

    // Urutkan hari sesuai urutan minggu
    newDays.sort((a, b) => DAYS.indexOf(a) - DAYS.indexOf(b));
    setSelectedDays(newDays);
    updateOpeningHoursString(newDays, openTime, closeTime);
  };

  const handleTimeChange = (type: 'open' | 'close', value: string) => {
    if (type === 'open') {
      setOpenTime(value);
      updateOpeningHoursString(selectedDays, value, closeTime);
    } else {
      setCloseTime(value);
      updateOpeningHoursString(selectedDays, openTime, value);
    }
  };

  const updateOpeningHoursString = (days: string[], open: string, close: string) => {
    // Format Akhir: "Senin, Selasa, Rabu: 08:00 - 17:00"
    let result = "";
    if (days.length === 0) {
      result = "Tutup / Belum diatur";
    } else if (days.length === 7) {
      result = `Setiap Hari: ${open} - ${close}`;
    } else {
      result = `${days.join(', ')}: ${open} - ${close}`;
    }
    setFormData(prev => ({ ...prev, openingHours: result }));
  };
  // ----------------------------------------------

  const handleSaveProfile = async () => {
    if (!auth.currentUser) return;
    setSaving(true);
    try {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      const updates = {
        description: formData.description,
        address: formData.address,
        phoneNumber: formData.phone,
        email: formData.email,
        openingHours: formData.openingHours, // String hasil builder
        established: formData.established
      };

      await updateDoc(userDocRef, updates);
      setBusinessProfile(prev => ({ ...prev, ...formData }));
      setIsEditing(false);
      toast.success("Informasi bisnis berhasil disimpan!");
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Gagal menyimpan perubahan.");
    } finally {
      setSaving(false);
    }
  };

  const stats = [
    { label: 'Total Penjualan', value: businessProfile.totalSales.toString(), icon: Award },
    { label: 'Rating', value: businessProfile.rating.toString(), icon: Star },
    { label: 'Ulasan', value: businessProfile.totalReviews.toString(), icon: Star },
    { label: 'Respon Rate', value: `${businessProfile.responseRate}%`, icon: Award },
  ];

  const handleEditProfile = () => { toggleEdit(); };
  const handleChangePhoto = () => { fileInputRef.current?.click(); };
  const handleViewAllReviews = () => { toast.info('Menampilkan semua ulasan pelanggan...'); };
  const handleSettings = () => { toast.info('Membuka pengaturan aplikasi...'); };

  const handleLogout = async () => {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
      try {
        await signOut(auth);
        toast.success('Berhasil keluar. Sampai jumpa lagi!');
      } catch (error) {
        toast.error('Gagal keluar');
      }
    }
  };

  const menuItems = [
    { label: 'Edit Profil Bisnis', icon: Edit2, action: handleEditProfile },
    { label: 'Pengaturan', icon: Settings, action: handleSettings },
    { label: 'Keluar', icon: LogOut, action: handleLogout, danger: true },
  ];

  const reviews = [
    {
      id: '1',
      customer: 'Budi Santoso',
      rating: 5,
      comment: 'Keripik singkongnya enak banget! Renyah dan tidak terlalu berminyak.',
      date: '2025-12-01',
      product: 'Keripik Singkong Original',
    },
    {
      id: '2',
      customer: 'Siti Aminah',
      rating: 5,
      comment: 'Sambal matahnya seger, cocok buat lauk makan. Pasti order lagi!',
      date: '2025-11-28',
      product: 'Sambal Matah',
    },
    {
      id: '3',
      customer: 'Ahmad Yani',
      rating: 4,
      comment: 'Kue lapisnya enak, tapi harganya agak mahal. Overall recommended.',
      date: '2025-11-25',
      product: 'Kue Lapis Legit',
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-6">
      <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />

      {/* Header */}
      <div className="relative">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600"></div>
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2">
          <div className="relative">
            <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
              <AvatarImage src={auth.currentUser?.photoURL || businessProfile.image} referrerPolicy="no-referrer" className="object-cover" />
              <AvatarFallback className="bg-blue-600 text-white">
                {businessProfile.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors" onClick={handleChangePhoto} disabled={uploading}>
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 pt-16">
        <div className="text-center mb-6">
          <h2 className="font-bold text-2xl capitalize text-gray-900 mb-1">{businessProfile.name}</h2>
          <div className="flex items-center justify-center gap-1 text-sm text-gray-500 mb-2">
            <User className="w-3 h-3" />
            <span className="font-medium capitalize">{businessProfile.owner}</span>
          </div>
          <Badge variant="secondary" className="mb-2">{businessProfile.category}</Badge>
          <div className="flex items-center justify-center gap-1 text-orange-500 mt-1">
            <Star className="w-4 h-4 fill-orange-500" />
            <span className="font-semibold text-sm">{businessProfile.rating}</span>
            <span className="text-gray-400 text-xs">({businessProfile.totalReviews} ulasan)</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-3 text-center">
                <Icon className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <p className="text-xs text-gray-600 mb-1">{stat.label}</p>
                <p className="text-sm font-semibold">{stat.value}</p>
              </Card>
            );
          })}
        </div>

        <Card className="p-4 mb-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900">Informasi Bisnis</h3>
            {isEditing ? (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={toggleEdit} className="h-8 w-8 p-0 text-red-500 bg-red-50 hover:bg-red-100 rounded-full">
                  <X className="w-4 h-4" />
                </Button>
                <Button size="sm" onClick={handleSaveProfile} disabled={saving} className="h-8 bg-green-600 hover:bg-green-700 text-white rounded-full px-4">
                  {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <><Save className="w-3 h-3 mr-1" /> Simpan</>}
                </Button>
              </div>
            ) : (
              <Button variant="ghost" size="sm" onClick={toggleEdit}>
                <Edit2 className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div className="mb-4">
            {isEditing ? (
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Contoh: Toko kami menyediakan..."
                className="w-full text-sm p-2 border rounded-md min-h-[80px] focus:ring-2 focus:ring-blue-500 outline-none"
              />
            ) : (
              <p className={`text-sm leading-relaxed ${!businessProfile.description ? 'text-gray-400 italic' : 'text-gray-600'}`}>
                {businessProfile.description || "Deskripsi toko belum diisi."}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex gap-3">
              <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-2" />
              <div className="w-full">
                <p className="text-xs text-gray-500 mb-0.5">Alamat</p>
                {isEditing ? (
                  <Input name="address" value={formData.address} onChange={handleInputChange} placeholder="Alamat lengkap" className="h-8 text-sm" />
                ) : (
                  <p className="text-sm font-medium text-gray-900">{businessProfile.address || "-"}</p>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Phone className="w-5 h-5 text-gray-400 flex-shrink-0 mt-2" />
              <div className="w-full">
                <p className="text-xs text-gray-500 mb-0.5">Telepon</p>
                {isEditing ? (
                  <Input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="08..." className="h-8 text-sm" />
                ) : (
                  <p className="text-sm font-medium text-gray-900">{businessProfile.phone || "-"}</p>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Mail className="w-5 h-5 text-gray-400 flex-shrink-0 mt-2" />
              <div className="w-full">
                <p className="text-xs text-gray-500 mb-0.5">Email</p>
                {isEditing ? (
                  <Input name="email" value={formData.email} onChange={handleInputChange} placeholder="Email bisnis" className="h-8 text-sm" />
                ) : (
                  <p className="text-sm font-medium text-gray-900">{businessProfile.email || "-"}</p>
                )}
              </div>
            </div>

            {/* --- BAGIAN JAM OPERASIONAL YANG DIUBAH --- */}
            <div className="flex gap-3">
              <Clock className="w-5 h-5 text-gray-400 flex-shrink-0 mt-2" />
              <div className="w-full">
                <p className="text-xs text-gray-500 mb-0.5">Jam Operasional</p>
                {isEditing ? (
                  <div className="bg-gray-50 p-3 rounded-lg border border-dashed border-gray-300 space-y-3">
                    {/* 1. Pilih Hari */}
                    <div>
                      <span className="text-xs font-semibold text-gray-600 block mb-2">Pilih Hari Buka:</span>
                      <div className="flex flex-wrap gap-2">
                        {DAYS.map(day => (
                          <label key={day} className={`flex items-center justify-center px-3 py-1 rounded-full text-xs cursor-pointer border transition-all ${selectedDays.includes(day) ? 'bg-blue-100 border-blue-400 text-blue-700 font-medium' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-100'}`}>
                            <input
                              type="checkbox"
                              className="hidden"
                              checked={selectedDays.includes(day)}
                              onChange={() => handleDayToggle(day)}
                            />
                            {day.substring(0, 3)} {/* Tampilkan Singkatan (Sen, Sel...) agar hemat tempat */}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* 2. Pilih Jam */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <span className="text-xs text-gray-500 block mb-1">Buka</span>
                        <Input type="time" value={openTime} onChange={(e) => handleTimeChange('open', e.target.value)} className="h-8 text-xs bg-white" />
                      </div>
                      <span className="text-gray-400 mt-4">-</span>
                      <div className="flex-1">
                        <span className="text-xs text-gray-500 block mb-1">Tutup</span>
                        <Input type="time" value={closeTime} onChange={(e) => handleTimeChange('close', e.target.value)} className="h-8 text-xs bg-white" />
                      </div>
                    </div>

                    {/* Preview Hasil */}
                    <div className="text-xs text-center text-gray-400 pt-1 border-t">
                      Preview: {formData.openingHours || "Belum diatur"}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm font-medium text-gray-900">{businessProfile.openingHours || "-"}</p>
                )}
              </div>
            </div>
            {/* ------------------------------------------- */}

            <div className="flex gap-3">
              <Store className="w-5 h-5 text-gray-400 flex-shrink-0 mt-2" />
              <div className="w-full">
                <p className="text-xs text-gray-500 mb-0.5">Berdiri Sejak</p>
                {isEditing ? (
                  <Input name="established" value={formData.established} onChange={handleInputChange} placeholder="Tahun" className="h-8 text-sm" />
                ) : (
                  <p className="text-sm font-medium text-gray-900">{businessProfile.established || "-"}</p>
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 mb-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900">Ulasan Pelanggan</h3>
            <button className="text-sm text-blue-600 font-medium" onClick={handleViewAllReviews}>Lihat Semua</button>
          </div>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="pb-4 border-b last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="mb-1 font-medium text-sm">{review.customer}</p>
                    <p className="text-xs text-gray-500">{review.product}</p>
                  </div>
                  <div className="flex items-center gap-1 text-orange-500">
                    <Star className="w-3 h-3 fill-orange-500" />
                    <span className="text-xs font-medium">{review.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{review.comment}</p>
                <p className="text-xs text-gray-400">
                  {new Date(review.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="mb-4 overflow-hidden">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={item.action}
                className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${index !== menuItems.length - 1 ? 'border-b border-gray-100' : ''} ${item.danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${item.danger ? 'bg-red-100' : 'bg-gray-100'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            );
          })}
        </Card>
      </div>
    </div>
  );
}