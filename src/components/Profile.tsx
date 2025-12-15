import { useState } from 'react';
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
  ChevronRight
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';

export function Profile() {
  const [businessProfile] = useState({
    name: 'Toko Makanan Ibu Sari',
    category: 'Makanan & Minuman',
    description: 'Menyediakan berbagai macam makanan tradisional dan cemilan khas dengan kualitas terbaik. Kami selalu mengutamakan cita rasa dan kepuasan pelanggan.',
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

  const stats = [
    { label: 'Total Penjualan', value: businessProfile.totalSales.toString(), icon: Award },
    { label: 'Rating', value: businessProfile.rating.toString(), icon: Star },
    { label: 'Ulasan', value: businessProfile.totalReviews.toString(), icon: Star },
    { label: 'Respon Rate', value: `${businessProfile.responseRate}%`, icon: Award },
  ];

  const handleEditProfile = () => {
    toast.info('Membuka editor profil bisnis...');
    // Di aplikasi lengkap, ini akan membuka form edit profil
  };

  const handleChangePhoto = () => {
    toast.info('Fitur upload foto akan segera tersedia');
    // Di aplikasi lengkap, ini akan membuka file picker
  };

  const handleViewAllReviews = () => {
    toast.info('Menampilkan semua ulasan pelanggan...');
    // Di aplikasi lengkap, ini akan membuka halaman reviews lengkap
  };

  const handleSettings = () => {
    toast.info('Membuka pengaturan aplikasi...');
    // Di aplikasi lengkap, ini akan navigate ke halaman settings
  };

  const handleLogout = () => {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
      toast.success('Berhasil keluar. Sampai jumpa lagi!');
      // Di aplikasi lengkap, ini akan clear session dan redirect ke login
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
              <AvatarImage src={businessProfile.image} />
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
        {/* Business Name & Category */}
        <div className="text-center mb-6">
          <h2 className="mb-1">{businessProfile.name}</h2>
          <Badge variant="secondary" className="mb-2">{businessProfile.category}</Badge>
          <div className="flex items-center justify-center gap-1 text-orange-500">
            <Star className="w-5 h-5 fill-orange-500" />
            <span>{businessProfile.rating}</span>
            <span className="text-gray-500 text-sm">({businessProfile.totalReviews} ulasan)</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-3 text-center">
                <Icon className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <p className="text-xs text-gray-600 mb-1">{stat.label}</p>
                <p className="text-sm">{stat.value}</p>
              </Card>
            );
          })}
        </div>

        {/* Business Info */}
        <Card className="p-4 mb-4">
          <div className="flex justify-between items-start mb-4">
            <h3>Informasi Bisnis</h3>
            <Button variant="ghost" size="sm" onClick={handleEditProfile}>
              <Edit2 className="w-4 h-4" />
            </Button>
          </div>

          <p className="text-sm text-gray-600 mb-4">{businessProfile.description}</p>

          <div className="space-y-3">
            <div className="flex gap-3">
              <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600 mb-1">Alamat</p>
                <p className="text-sm">{businessProfile.address}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Phone className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600 mb-1">Telepon</p>
                <p className="text-sm">{businessProfile.phone}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Mail className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600 mb-1">Email</p>
                <p className="text-sm">{businessProfile.email}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Clock className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600 mb-1">Jam Operasional</p>
                <p className="text-sm">{businessProfile.openingHours}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Store className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600 mb-1">Berdiri Sejak</p>
                <p className="text-sm">{businessProfile.established}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Reviews */}
        <Card className="p-4 mb-4">
          <div className="flex justify-between items-center mb-4">
            <h3>Ulasan Pelanggan</h3>
            <button className="text-sm text-blue-600" onClick={handleViewAllReviews}>Lihat Semua</button>
          </div>

          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="pb-4 border-b last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="mb-1">{review.customer}</p>
                    <p className="text-xs text-gray-500">{review.product}</p>
                  </div>
                  <div className="flex items-center gap-1 text-orange-500">
                    <Star className="w-4 h-4 fill-orange-500" />
                    <span className="text-sm">{review.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{review.comment}</p>
                <p className="text-xs text-gray-500">
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
        <Card className="mb-4">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={item.action}
                className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
                  index !== menuItems.length - 1 ? 'border-b' : ''
                } ${item.danger ? 'text-red-600' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
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