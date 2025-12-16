import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import { useState, useEffect } from 'react';
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
  User
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { toast } from 'sonner';

export function Profile() {
  const [businessProfile, setBusinessProfile] = useState({
    name: 'Memuat Toko...',
    owner: '', // Field baru untuk nama pemilik
    category: 'Makanan & Minuman',
    description: 'Menyediakan berbagai macam makanan tradisional dan cemilan khas dengan kualitas terbaik.',
    address: 'Jl. Merdeka No. 123, Jakarta Selatan',
    phone: '081234567890',
    email: 'ibusari@gmail.com',
    openingHours: 'Senin - Sabtu: 08:00 - 20:00',
    established: '2020',
    rating: 4.8,
    totalReviews: 156,
    totalSales: 1247,
    responseRate: 98,
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400',
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setBusinessProfile(prev => ({
              ...prev,
              name: data.storeName || user.displayName || "Toko Saya",
              owner: data.ownerName || user.displayName || "Pemilik", // Ambil ownerName dari DB
              email: user.email || prev.email,
              phone: data.phoneNumber || prev.phone // Sekalian update no hp jika ada
            }));
          } else {
            setBusinessProfile(prev => ({
              ...prev,
              name: user.displayName || "Toko Baru",
              owner: user.displayName || "Pemilik",
              email: user.email || prev.email
            }));
          }
        } catch (error) {
          console.error("Error fetching store data:", error);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const stats = [
    { label: 'Total Penjualan', value: businessProfile.totalSales.toString(), icon: Award },
    { label: 'Rating', value: businessProfile.rating.toString(), icon: Star },
    { label: 'Ulasan', value: businessProfile.totalReviews.toString(), icon: Star },
    { label: 'Respon Rate', value: `${businessProfile.responseRate}%`, icon: Award },
  ];

  const handleEditProfile = () => {
    toast.info('Membuka editor profil bisnis...');
  };

  const handleChangePhoto = () => {
    toast.info('Fitur upload foto akan segera tersedia');
  };

  const handleViewAllReviews = () => {
    toast.info('Menampilkan semua ulasan pelanggan...');
  };

  const handleSettings = () => {
    toast.info('Membuka pengaturan aplikasi...');
  };

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
      {/* Header with Cover */}
      <div className="relative">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600"></div>
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2">
          <div className="relative">
            <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
              <AvatarImage
                src={auth.currentUser?.photoURL || businessProfile.image}
                referrerPolicy="no-referrer"
                className="object-cover"
              />
              <AvatarFallback className="bg-blue-600 text-white">
                {businessProfile.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg" onClick={handleChangePhoto}>
              <Camera className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 pt-16">

        {/* BAGIAN NAMA TOKO & PEMILIK */}
        <div className="text-center mb-6">
          {/* Nama Toko (Tebal & Besar) */}
          <h2 className="font-bold text-2xl capitalize text-gray-900 mb-1">{businessProfile.name}</h2>

          {/* Nama Pemilik (Kecil & Abu-abu) */}
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
        {/* --------------------------- */}

        {/* Stats Grid */}
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

        {/* Business Info */}
        <Card className="p-4 mb-4">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-semibold text-gray-900">Informasi Bisnis</h3>
            <Button variant="ghost" size="sm" onClick={handleEditProfile}>
              <Edit2 className="w-4 h-4" />
            </Button>
          </div>

          <p className="text-sm text-gray-600 mb-4 leading-relaxed">{businessProfile.description}</p>

          <div className="space-y-3">
            <div className="flex gap-3">
              <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Alamat</p>
                <p className="text-sm font-medium text-gray-900">{businessProfile.address}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Phone className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Telepon</p>
                <p className="text-sm font-medium text-gray-900">{businessProfile.phone}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Mail className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Email</p>
                <p className="text-sm font-medium text-gray-900">{businessProfile.email}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Clock className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Jam Operasional</p>
                <p className="text-sm font-medium text-gray-900">{businessProfile.openingHours}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Store className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Berdiri Sejak</p>
                <p className="text-sm font-medium text-gray-900">{businessProfile.established}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Reviews */}
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
                  {new Date(review.date).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Menu Items */}
        <Card className="mb-4 overflow-hidden">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={item.action}
                className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${index !== menuItems.length - 1 ? 'border-b border-gray-100' : ''
                  } ${item.danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700'}`}
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