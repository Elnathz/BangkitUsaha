# 📱 Panduan Edit UI Bangkit Usaha

## 🎨 Struktur Aplikasi

Aplikasi ini menggunakan arsitektur component-based dengan React. Berikut adalah struktur file:

```
/
├── App.tsx                      # Main aplikasi dengan bottom navigation
├── components/
│   ├── Dashboard.tsx           # Halaman beranda
│   ├── Transactions.tsx        # Halaman pencatatan keuangan
│   ├── Products.tsx            # Halaman kelola produk
│   ├── Orders.tsx              # Halaman kelola pesanan
│   ├── Profile.tsx             # Halaman profil UMKM
│   ├── Onboarding.tsx          # Tutorial awal
│   ├── Notifications.tsx       # Halaman notifikasi
│   ├── Chat.tsx                # Halaman chat
│   ├── Tips.tsx                # Halaman tips bisnis
│   └── Catalog.tsx             # Halaman browsing produk
└── components/ui/              # Komponen UI dasar (ShadCN)
```

---

## 🎯 Cara Edit Setiap Komponen

### 1️⃣ **Dashboard** (`/components/Dashboard.tsx`)

**Mengubah Data Mingguan/Bulanan:**
```typescript
// Cari bagian ini (baris ~20-35):
const weeklyData = {
  revenue: 4850000,        // ← Ubah total pendapatan mingguan
  revenueChange: 12.5,     // ← Ubah persentase perubahan
  orders: 28,              // ← Ubah jumlah pesanan
  ordersChange: 8,         // ← Ubah perubahan pesanan
  products: 15,            // ← Ubah jumlah produk
  newCustomers: 12,        // ← Ubah pelanggan baru
};
```

**Mengubah Pesanan Terbaru:**
```typescript
// Cari bagian ini (baris ~45-50):
const recentOrders = [
  { 
    id: '001', 
    customer: 'Budi Santoso',     // ← Nama pelanggan
    product: 'Keripik Singkong',  // ← Nama produk
    amount: 75000,                // ← Jumlah uang
    status: 'pending'             // ← Status: pending/completed/processing
  },
  // Tambahkan lebih banyak pesanan di sini...
];
```

**Mengubah Warna Gradient Header:**
```tsx
// Cari bagian ini (baris ~67):
<div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 pb-8">
//              ↑ Ubah warna ini: from-[warna]-600 to-[warna]-700
// Pilihan: blue, green, purple, orange, red, pink, indigo, teal
```

---

### 2️⃣ **Transactions** (`/components/Transactions.tsx`)

**Mengubah Transaksi Default:**
```typescript
// Cari bagian ini (baris ~25-60):
const [transactions, setTransactions] = useState<Transaction[]>([
  { 
    id: '1', 
    type: 'income',                          // ← 'income' atau 'expense'
    category: 'Penjualan Produk',           // ← Kategori transaksi
    amount: 250000,                         // ← Jumlah uang
    description: 'Penjualan Keripik',       // ← Deskripsi
    date: '2025-12-03'                      // ← Tanggal (YYYY-MM-DD)
  },
  // Tambahkan lebih banyak transaksi...
]);
```

**Mengubah Warna Header:**
```tsx
// Baris ~115:
<div className="bg-gradient-to-r from-green-600 to-green-700">
//              ↑ Ubah 'green' ke warna lain
```

---

### 3️⃣ **Products** (`/components/Products.tsx`)

**Mengubah Data Produk:**
```typescript
// Cari bagian ini (baris ~30-70):
const [products, setProducts] = useState<Product[]>([
  {
    id: '1',
    name: 'Keripik Singkong Original',      // ← Nama produk
    category: 'Makanan',                    // ← Kategori
    price: 25000,                           // ← Harga jual
    stock: 50,                              // ← Stok tersedia
    description: 'Keripik singkong renyah', // ← Deskripsi
    image: 'https://...',                   // ← URL gambar
    marketPriceMin: 20000,                  // ← Harga pasar minimum
    marketPriceMax: 30000,                  // ← Harga pasar maksimum
  },
]);
```

**Mengubah Kategori Produk:**
```typescript
// Baris ~90:
const categories = ['Semua', 'Makanan', 'Minuman', 'Kue', 'Kerajinan'];
//                   ↑ Tambah atau ubah kategori di sini
```

**Mengubah Warna Header:**
```tsx
// Baris ~125:
<div className="bg-gradient-to-r from-purple-600 to-purple-700">
```

---

### 4️⃣ **Orders** (`/components/Orders.tsx`)

**Mengubah Data Pesanan:**
```typescript
// Baris ~40-100:
const [orders, setOrders] = useState<Order[]>([
  {
    id: '1',
    orderNumber: 'ORD-001',                 // ← Nomor pesanan
    customer: {
      name: 'Budi Santoso',                 // ← Nama pelanggan
      phone: '081234567890',                // ← Nomor telepon
      address: 'Jl. Merdeka No. 123',       // ← Alamat
    },
    items: [
      { 
        name: 'Keripik Singkong',           // ← Nama item
        quantity: 3,                        // ← Jumlah
        price: 25000                        // ← Harga satuan
      },
    ],
    total: 110000,                          // ← Total harga
    status: 'pending',                      // ← pending/processing/completed/cancelled
    paymentMethod: 'transfer',              // ← 'transfer' atau 'cod'
    date: '2025-12-03T10:30:00',           // ← Tanggal & waktu
    notes: 'Mohon dikemas rapi',           // ← Catatan (opsional)
  },
]);
```

**Mengubah Warna Status:**
```typescript
// Baris ~105-115:
const getStatusInfo = (status: OrderStatus) => {
  switch (status) {
    case 'pending':
      return { 
        label: 'Menunggu',                          // ← Label status
        color: 'bg-orange-100 text-orange-700',    // ← Warna badge
        icon: Clock                                 // ← Icon
      };
    // Edit status lainnya...
  }
};
```

---

### 5️⃣ **Profile** (`/components/Profile.tsx`)

**Mengubah Data Profil Bisnis:**
```typescript
// Baris ~18-35:
const [businessProfile] = useState({
  name: 'Toko Makanan Ibu Sari',          // ← Nama bisnis
  category: 'Makanan & Minuman',          // ← Kategori bisnis
  description: 'Menyediakan berbagai...',  // ← Deskripsi
  address: 'Jl. Merdeka No. 123',         // ← Alamat
  phone: '081234567890',                  // ← Telepon
  email: 'ibusari@gmail.com',             // ← Email
  openingHours: 'Senin - Sabtu: 08:00',   // ← Jam operasional
  established: '2020',                    // ← Tahun berdiri
  rating: 4.8,                            // ← Rating (0-5)
  totalReviews: 156,                      // ← Jumlah ulasan
  totalSales: 1247,                       // ← Total penjualan
  responseRate: 98,                       // ← Response rate (%)
  image: 'https://...',                   // ← URL foto profil
});
```

**Mengubah Data Review:**
```typescript
// Baris ~80-105:
const reviews = [
  {
    id: '1',
    customer: 'Budi Santoso',              // ← Nama pelanggan
    rating: 5,                             // ← Rating (1-5)
    comment: 'Keripik singkongnya enak',   // ← Komentar
    date: '2025-12-01',                    // ← Tanggal
    product: 'Keripik Singkong Original',  // ← Nama produk
  },
];
```

---

### 6️⃣ **Onboarding** (`/components/Onboarding.tsx`)

**Mengubah Slide Tutorial:**
```typescript
// Baris ~12-35:
const slides = [
  {
    icon: TrendingUp,                      // ← Icon dari lucide-react
    title: 'Kelola Bisnis Lebih Mudah',    // ← Judul slide
    description: 'Catat keuangan...',      // ← Deskripsi
    color: 'text-blue-600',                // ← Warna icon
    bg: 'bg-blue-50',                      // ← Warna background
  },
  // Tambah atau edit slide lainnya...
];
```

---

### 7️⃣ **Chat** (`/components/Chat.tsx`)

**Mengubah Daftar Chat:**
```typescript
// Baris ~40-65:
const chatRooms: ChatRoom[] = [
  {
    id: '1',
    customer: { 
      name: 'Budi Santoso',                // ← Nama pelanggan
      avatar: 'https://...'                // ← URL foto (opsional)
    },
    lastMessage: 'Terima kasih',           // ← Pesan terakhir
    timestamp: '10:30',                    // ← Waktu
    unread: 0,                             // ← Jumlah unread
    isOnline: true,                        // ← Status online
  },
];
```

**Mengubah Pesan:**
```typescript
// Baris ~70-80:
const messages: { [key: string]: Message[] } = {
  '1': [
    { 
      id: '1', 
      sender: 'customer',                  // ← 'customer' atau 'me'
      text: 'Halo, saya mau pesan',        // ← Isi pesan
      timestamp: '10:00'                   // ← Waktu
    },
  ],
};
```

---

### 8️⃣ **Tips** (`/components/Tips.tsx`)

**Mengubah Daftar Tips:**
```typescript
// Baris ~20-65:
const tips: Tip[] = [
  {
    id: '1',
    title: '5 Cara Meningkatkan Penjualan',  // ← Judul tips
    category: 'Pemasaran',                   // ← Kategori
    excerpt: 'Pelajari strategi efektif...',  // ← Ringkasan
    readTime: '3 menit',                     // ← Waktu baca
    icon: TrendingUp,                        // ← Icon
    color: 'bg-green-100 text-green-600',   // ← Warna
  },
];
```

---

### 9️⃣ **Catalog** (`/components/Catalog.tsx`)

**Mengubah Data Produk Marketplace:**
```typescript
// Baris ~30-75:
const products: CatalogProduct[] = [
  {
    id: '1',
    name: 'Keripik Singkong Pedas',        // ← Nama produk
    seller: 'Toko Cemilan Nusantara',      // ← Nama penjual
    price: 28000,                          // ← Harga
    rating: 4.8,                           // ← Rating
    reviews: 245,                          // ← Jumlah review
    sold: 850,                             // ← Jumlah terjual
    image: 'https://...',                  // ← URL gambar
    category: 'Makanan',                   // ← Kategori
    location: 'Jakarta',                   // ← Lokasi
  },
];
```

---

## 🎨 Mengubah Warna Global

### Warna yang Tersedia di Tailwind:
- `blue` - Biru
- `green` - Hijau
- `purple` - Ungu
- `orange` - Oranye
- `red` - Merah
- `pink` - Pink
- `indigo` - Indigo
- `teal` - Teal
- `yellow` - Kuning

### Tingkat Warna:
- `50` - Paling terang
- `100, 200, 300, 400, 500` - Sedang
- `600, 700, 800, 900` - Gelap

### Contoh Penggunaan:
```tsx
className="bg-blue-600"        // Background biru
className="text-green-700"     // Text hijau
className="border-red-500"     // Border merah
className="from-purple-600 to-pink-600"  // Gradient ungu ke pink
```

---

## 📱 Mengubah Layout Mobile

Aplikasi ini dioptimalkan untuk mobile dengan `max-w-md` (maksimal 448px lebar).

**Mengubah Lebar Maksimal:**
```tsx
// Di App.tsx, ubah:
<div className="flex flex-col h-screen bg-gray-50 max-w-md mx-auto">
//                                                  ↑ Ubah ini
// Pilihan: max-w-sm (384px), max-w-md (448px), max-w-lg (512px)
```

---

## 🔧 Tips Edit Manual

1. **Gunakan Find & Replace** - Cari teks tertentu untuk mengubah semua instance
2. **Backup File** - Selalu backup sebelum edit besar
3. **Edit Satu Komponen** - Fokus pada satu file untuk menghindari error
4. **Test Setelah Edit** - Simpan dan cek hasilnya di browser

---

## ❓ Troubleshooting

**Error: "Cannot find module"**
- Pastikan import path benar
- Cek ejaan nama file

**UI Tidak Berubah:**
- Refresh browser (Ctrl + Shift + R)
- Cek console untuk error

**Layout Berantakan:**
- Pastikan className lengkap
- Cek penutup tag `</div>` dan `</>`

---

## 📞 Struktur Data Penting

### Format Tanggal:
```typescript
'2025-12-03'              // Untuk date input
'2025-12-03T10:30:00'     // Untuk datetime lengkap
```

### Format Harga:
```typescript
price: 25000              // Simpan sebagai number
Rp {price.toLocaleString('id-ID')}  // Tampilkan dengan format
```

### Format Status:
```typescript
'pending'      // Menunggu
'processing'   // Diproses  
'completed'    // Selesai
'cancelled'    // Dibatalkan
```

---

Selamat mengedit! 🎉
