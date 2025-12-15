import { useState } from 'react';
import { ArrowLeft, Search, Filter, Star, ShoppingCart, MessageCircle } from 'lucide-react';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';

interface CatalogProps {
  onClose: () => void;
}

interface CatalogProduct {
  id: string;
  name: string;
  seller: string;
  price: number;
  rating: number;
  reviews: number;
  sold: number;
  image: string;
  category: string;
  location: string;
}

export function Catalog({ onClose }: CatalogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('relevant');
  const [selectedProduct, setSelectedProduct] = useState<CatalogProduct | null>(null);

  const products: CatalogProduct[] = [
    {
      id: '1',
      name: 'Keripik Singkong Pedas Manis',
      seller: 'Toko Cemilan Nusantara',
      price: 28000,
      rating: 4.8,
      reviews: 245,
      sold: 850,
      image: 'https://images.unsplash.com/photo-1600952841320-db92ec4047ca?w=400',
      category: 'Makanan',
      location: 'Jakarta',
    },
    {
      id: '2',
      name: 'Sambal Matah Khas Bali Premium',
      seller: 'Warung Bali Asli',
      price: 42000,
      rating: 4.9,
      reviews: 532,
      sold: 1240,
      image: 'https://images.unsplash.com/photo-1626190412703-c9e8f03e46f9?w=400',
      category: 'Makanan',
      location: 'Bali',
    },
    {
      id: '3',
      name: 'Kue Lapis Legit Spesial',
      seller: 'Toko Kue Ibu Santi',
      price: 165000,
      rating: 4.7,
      reviews: 128,
      sold: 320,
      image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400',
      category: 'Kue',
      location: 'Bandung',
    },
    {
      id: '4',
      name: 'Dodol Durian Original',
      seller: 'UMKM Berkah Jaya',
      price: 55000,
      rating: 4.6,
      reviews: 89,
      sold: 450,
      image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400',
      category: 'Makanan',
      location: 'Medan',
    },
    {
      id: '5',
      name: 'Abon Sapi Premium',
      seller: 'Toko Oleh-oleh Pak Haji',
      price: 75000,
      rating: 4.8,
      reviews: 312,
      sold: 680,
      image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400',
      category: 'Makanan',
      location: 'Surabaya',
    },
    {
      id: '6',
      name: 'Brownies Cokelat Lembut',
      seller: 'Bakery Mama Ririn',
      price: 45000,
      rating: 4.9,
      reviews: 421,
      sold: 920,
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400',
      category: 'Kue',
      location: 'Jakarta',
    },
  ];

  const categories = ['Semua', 'Makanan', 'Minuman', 'Kue', 'Kerajinan'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.seller.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'popular':
        return b.sold - a.sold;
      default:
        return 0;
    }
  });

  const handleChatSeller = (productName: string, sellerName: string) => {
    toast.success(`Membuka chat dengan ${sellerName} tentang ${productName}`);
    // Di aplikasi lengkap, ini akan membuka chat dengan seller
  };

  const handleBuyProduct = (productName: string, price: number) => {
    toast.success(`Menambahkan ${productName} ke keranjang (Rp ${price.toLocaleString('id-ID')})`);
    // Di aplikasi lengkap, ini akan menambah produk ke cart atau langsung checkout
  };

  const handleViewProductDetail = (product: CatalogProduct) => {
    setSelectedProduct(product);
    toast.info(`Melihat detail produk: ${product.name}`);
    // Di aplikasi lengkap, ini akan membuka halaman detail produk
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b p-4 z-10">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onClose}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="flex-1">Jelajahi Produk</h2>
        </div>

        {/* Search Bar */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Cari produk UMKM..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter & Sort */}
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="flex-1">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevant">Paling Relevan</SelectItem>
              <SelectItem value="popular">Terpopuler</SelectItem>
              <SelectItem value="rating">Rating Tertinggi</SelectItem>
              <SelectItem value="price-low">Harga Terendah</SelectItem>
              <SelectItem value="price-high">Harga Tertinggi</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="p-4">
        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-4">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category.toLowerCase() || (category === 'Semua' && selectedCategory === 'all') ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category === 'Semua' ? 'all' : category)}
              className="whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-3">
          {sortedProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="relative">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-cover"
                />
                <Badge className="absolute top-2 left-2 bg-white/90 text-gray-900 text-xs">
                  <Star className="w-3 h-3 fill-orange-500 text-orange-500 mr-1" />
                  {product.rating}
                </Badge>
              </div>

              <div className="p-3">
                <h4 className="text-sm mb-1 line-clamp-2 min-h-[2.5rem]">{product.name}</h4>
                
                <p className="text-green-600 mb-2">
                  Rp {product.price.toLocaleString('id-ID')}
                </p>

                <p className="text-xs text-gray-600 mb-1 truncate">{product.seller}</p>
                <p className="text-xs text-gray-500 mb-2">📍 {product.location}</p>

                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                  <span>⭐ {product.rating} ({product.reviews})</span>
                  <span>•</span>
                  <span>{product.sold} terjual</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" variant="outline" className="text-xs h-8" onClick={() => handleChatSeller(product.name, product.seller)}>
                    <MessageCircle className="w-3 h-3 mr-1" />
                    Chat
                  </Button>
                  <Button size="sm" className="text-xs h-8" onClick={() => handleBuyProduct(product.name, product.price)}>
                    <ShoppingCart className="w-3 h-3 mr-1" />
                    Beli
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {sortedProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Tidak ada produk ditemukan</p>
          </div>
        )}
      </div>
    </div>
  );
}