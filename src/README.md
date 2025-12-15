# 🚀 Bangkit Usaha - Aplikasi UMKM

![Status](https://img.shields.io/badge/Status-Production%20Ready-green)
![Platform](https://img.shields.io/badge/Platform-Mobile%20First-blue)
![React](https://img.shields.io/badge/React-18.x-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6)
![Tailwind](https://img.shields.io/badge/Tailwind-4.x-38bdf8)

Aplikasi mobile-first lengkap untuk membantu UMKM mengelola bisnis mereka dengan mudah dan efisien.

## 📱 Fitur Utama

### 💰 Pencatatan Keuangan
- Catat pemasukan dan pengeluaran dengan mudah
- Dashboard keuangan dengan summary real-time
- Filter transaksi (Semua, Pemasukan, Pengeluaran)
- Export data keuangan
- Visualisasi saldo saat ini

### 📦 Manajemen Produk
- Upload dan kelola produk
- Smart pricing recommendations
- Kategori produk (Makanan, Minuman, Kue, Kerajinan)
- Edit dan hapus produk
- Indicator harga kompetitif vs market price

### 🛒 Order Management
- Kelola pesanan dengan status tracking
- Filter pesanan: Pending, Processing, Completed
- Detail pelanggan dan item pesanan
- Update status pesanan dengan mudah
- Support COD dan Transfer payment

### 📊 Dashboard Penjualan
- Data penjualan mingguan dan bulanan
- Revenue tracking dengan persentase perubahan
- Quick stats: Pesanan, Produk, Pelanggan Baru
- Recent orders dengan status
- Periode selector (Mingguan/Bulanan)

### 🏪 Marketplace & Catalog
- Jelajahi produk dari UMKM lainnya
- Search dan filter produk
- Sort berdasarkan harga, rating, popularitas
- Chat dengan penjual
- Direct buy from catalog

### 💬 Chat Penjual-Pembeli
- Real-time messaging interface
- Online status indicator
- Chat history
- Quick actions: Phone, Video Call
- Unread message counter

### 👥 Komunitas UMKM ⭐ NEW!
- **Feed/Timeline** - Berbagi pengalaman dan tips
- **Like, Comment, Share** - Interaksi dengan komunitas
- **Trending Topics** - Topik yang sedang hot
- **Grup Komunitas** - Bergabung dengan grup sesuai niche
- **Kategori Diskusi** - Tips Bisnis, Tanya Jawab, Sharing, dll
- **Verified Badges** - Badge untuk user terverifikasi

### 💡 Tips Bisnis
- Artikel praktis untuk meningkatkan bisnis
- Kategori: Pemasaran, Fotografi, Pricing, Customer Service
- Tips populer dan trending
- Daily tips untuk motivasi

### 🔔 Notifikasi & Reminder
- Notifikasi pesanan baru
- Reminder pencatatan keuangan
- Pesan masuk dari pembeli
- Update pencapaian penjualan

### 👤 Profil UMKM
- Profil bisnis lengkap
- Rating dan ulasan pelanggan
- Statistik bisnis (Total Penjualan, Rating, Response Rate)
- Informasi kontak dan alamat
- Edit profil dan pengaturan

### 📝 Onboarding
- Welcome screens untuk user baru
- Penjelasan fitur aplikasi
- Swipeable slides dengan ilustrasi

## 🎨 Design Features

- **Mobile-First**: Optimized untuk layar mobile
- **Modern UI**: Clean, intuitive, dan user-friendly
- **Responsive**: Adaptif untuk berbagai ukuran layar
- **Color Coded**: Setiap tab memiliki warna khas
- **Toast Notifications**: Feedback untuk setiap aksi
- **Smooth Animations**: Transisi yang halus
- **Bottom Navigation**: 5 tab utama mudah diakses

## 🏗️ Struktur Aplikasi

### Bottom Navigation (5 Tabs)
1. **🏠 Beranda** - Dashboard dan quick actions
2. **💰 Transaksi** - Pencatatan keuangan
3. **📦 Produk** - Manajemen produk
4. **🛒 Pesanan** - Order management
5. **👤 Profil** - Profil UMKM dan pengaturan

### Quick Actions dari Dashboard
- 🔍 **Cari Produk** - Buka katalog marketplace
- 👥 **Komunitas** - Buka fitur komunitas UMKM
- 💡 **Tips Bisnis** - Baca artikel bisnis

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Lucide React** - Icons
- **Shadcn/ui** - UI components
- **Sonner** - Toast notifications
- **Motion/React** - Animations (if needed)

## 📦 Komponen Utama

```
/components
├── Dashboard.tsx       # Dashboard utama
├── Transactions.tsx    # Pencatatan keuangan
├── Products.tsx        # Manajemen produk
├── Orders.tsx          # Order management
├── Profile.tsx         # Profil UMKM
├── Community.tsx       # Komunitas UMKM ⭐
├── Chat.tsx           # Chat interface
├── Catalog.tsx        # Product catalog
├── Tips.tsx           # Tips bisnis
├── Notifications.tsx  # Notifikasi
├── Onboarding.tsx     # Welcome screens
└── ui/                # Reusable UI components
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm atau yarn

### Installation

```bash
# Clone repository (jika ada)
git clone [repository-url]

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Environment Setup
Aplikasi ini adalah **frontend-only** dengan mock data. Tidak perlu environment variables untuk development.

## 📱 Usage Guide

### Untuk Pengguna Baru
1. Buka aplikasi, lihat onboarding screens
2. Skip atau lanjutkan untuk memahami fitur
3. Mulai dari Dashboard untuk overview
4. Tambah produk di tab Produk
5. Catat transaksi di tab Transaksi
6. Kelola pesanan di tab Pesanan
7. Bergabung dengan Komunitas untuk networking

### Fitur Interaktif
- ✅ Semua button dan card dapat diklik
- ✅ Toast notification untuk setiap aksi
- ✅ Dialog untuk input data (Add Product, Transaction, Post)
- ✅ Filter dan search yang responsif
- ✅ Like, comment, share di komunitas

## 🗺️ Roadmap

### ✅ Completed
- [x] UI/UX Design lengkap
- [x] Bottom navigation
- [x] Dashboard dengan periode selector
- [x] CRUD Produk dengan smart pricing
- [x] Order management dengan status tracking
- [x] Pencatatan keuangan
- [x] Chat interface
- [x] Marketplace catalog
- [x] Tips bisnis
- [x] Notifikasi
- [x] Profil UMKM
- [x] Onboarding
- [x] **Fitur Komunitas** dengan Feed, Trending, Groups
- [x] Toast notifications untuk semua aksi
- [x] All interactive elements working

### 🔄 Next Steps (Backend Integration)
- [ ] Connect to Supabase/Firebase
- [ ] Real authentication & authorization
- [ ] Database persistence untuk semua data
- [ ] Real-time updates untuk chat dan komunitas
- [ ] Image upload & storage
- [ ] Push notifications
- [ ] Analytics & reporting
- [ ] Payment gateway integration
- [ ] Export to PDF/Excel

### 💡 Future Enhancements
- [ ] Inventory management advanced
- [ ] Multi-location support
- [ ] Employee management
- [ ] Loyalty program
- [ ] QR code untuk produk
- [ ] Instagram/WhatsApp integration
- [ ] AI-powered insights
- [ ] Voice commands
- [ ] Offline mode

## 📚 Documentation

- [PANDUAN_EDIT_UI.md](./PANDUAN_EDIT_UI.md) - Panduan edit UI manual
- [DAFTAR_PERBAIKAN_INTERAKTIVITAS.md](./DAFTAR_PERBAIKAN_INTERAKTIVITAS.md) - Changelog interaktivitas
- [FITUR_KOMUNITAS.md](./FITUR_KOMUNITAS.md) - Dokumentasi lengkap fitur komunitas

## 🎯 Target Pengguna

- UMKM Makanan & Minuman
- UMKM Fashion & Kerajinan
- Home Industry
- Reseller & Dropshipper
- Pedagang Online
- Wirausaha Pemula

## 💪 Keunggulan

1. **All-in-One Solution** - Semua kebutuhan UMKM dalam satu aplikasi
2. **User Friendly** - Interface sederhana dan mudah dipahami
3. **Mobile First** - Optimized untuk penggunaan mobile
4. **No Learning Curve** - Intuitive, langsung bisa digunakan
5. **Community Driven** - Belajar dari sesama UMKM
6. **Free to Start** - Model freemium (base features gratis)
7. **Bahasa Indonesia** - Full support bahasa Indonesia
8. **Local Focus** - Disesuaikan dengan kebutuhan UMKM Indonesia

## 🤝 Contributing

Kontribusi sangat welcome! Beberapa area yang bisa dibantu:
- Bug reports
- Feature requests
- Code improvements
- Documentation
- Translation
- UI/UX suggestions

## 📄 License

[Tentukan license di sini]

## 👨‍💻 Development Team

Developed with ❤️ for Indonesian UMKM

## 📞 Support

Untuk bantuan dan pertanyaan:
- Email: [support email]
- WhatsApp: [support number]
- Community: [community link]

## 🙏 Acknowledgments

- Shadcn/ui untuk component library
- Lucide untuk icons
- Unsplash untuk sample images
- Komunitas UMKM Indonesia untuk feedback

---

**Made with ❤️ for UMKM Indonesia** 🇮🇩

**Version**: 1.0.0  
**Last Updated**: 7 Desember 2025  
**Status**: ✅ Production Ready (Frontend)
