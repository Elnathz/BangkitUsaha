import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, TrendingUp, DollarSign, Package } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  image: string;
  marketPriceMin?: number;
  marketPriceMax?: number;
}

export function Products() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Keripik Singkong Original',
      category: 'Makanan',
      price: 25000,
      stock: 50,
      description: 'Keripik singkong renyah dengan rasa original',
      image: 'https://images.unsplash.com/photo-1600952841320-db92ec4047ca?w=400',
      marketPriceMin: 20000,
      marketPriceMax: 30000,
    },
    {
      id: '2',
      name: 'Sambal Matah',
      category: 'Makanan',
      price: 35000,
      stock: 30,
      description: 'Sambal matah khas Bali, pedas dan segar',
      image: 'https://images.unsplash.com/photo-1626190412703-c9e8f03e46f9?w=400',
      marketPriceMin: 30000,
      marketPriceMax: 40000,
    },
    {
      id: '3',
      name: 'Kue Lapis Legit',
      category: 'Kue',
      price: 150000,
      stock: 10,
      description: 'Kue lapis legit premium dengan mentega berkualitas',
      image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400',
      marketPriceMin: 120000,
      marketPriceMax: 180000,
    },
  ]);

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
  });

  const categories = ['Semua', 'Makanan', 'Minuman', 'Kue', 'Kerajinan'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price) return;

    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name,
      category: newProduct.category || 'Lainnya',
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock) || 0,
      description: newProduct.description,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
    };

    setProducts([product, ...products]);
    setIsAddDialogOpen(false);
    setNewProduct({
      name: '',
      category: '',
      price: '',
      stock: '',
      description: '',
    });
    toast.success('Produk baru berhasil ditambahkan');
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsEditDialogOpen(true);
    toast.info(`Mengedit produk: ${product.name}`);
  };

  const handleDeleteProduct = (productId: string, productName: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus produk "${productName}"?`)) {
      setProducts(products.filter(p => p.id !== productId));
      toast.success(`Produk "${productName}" berhasil dihapus`);
    }
  };

  const handleSaveEdit = () => {
    if (!editingProduct) return;
    
    setProducts(products.map(p => 
      p.id === editingProduct.id ? editingProduct : p
    ));
    setIsEditDialogOpen(false);
    setEditingProduct(null);
    toast.success('Produk berhasil diperbarui');
  };

  const getPriceRecommendation = (product: Product) => {
    if (!product.marketPriceMin || !product.marketPriceMax) return null;
    
    const avgPrice = (product.marketPriceMin + product.marketPriceMax) / 2;
    const isCompetitive = product.price >= product.marketPriceMin && product.price <= product.marketPriceMax;
    const isCheap = product.price < product.marketPriceMin;
    
    return { avgPrice, isCompetitive, isCheap };
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 pb-8">
        <h1 className="mb-6">Kelola Produk</h1>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Cari produk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white"
          />
        </div>
      </div>

      <div className="px-4 -mt-4 pb-6">
        {/* Add Product Button */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full mb-4 shadow-md">
              <Plus className="w-5 h-5 mr-2" />
              Tambah Produk Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tambah Produk Baru</DialogTitle>
              <DialogDescription>Masukkan detail produk baru Anda.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="product-name">Nama Produk</Label>
                <Input
                  id="product-name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="Contoh: Keripik Singkong"
                />
              </div>

              <div>
                <Label htmlFor="category">Kategori</Label>
                <Select value={newProduct.category} onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Makanan">Makanan</SelectItem>
                    <SelectItem value="Minuman">Minuman</SelectItem>
                    <SelectItem value="Kue">Kue</SelectItem>
                    <SelectItem value="Kerajinan">Kerajinan</SelectItem>
                    <SelectItem value="Lainnya">Lainnya</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="price">Harga (Rp)</Label>
                <Input
                  id="price"
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  placeholder="0"
                />
              </div>

              <div>
                <Label htmlFor="stock">Stok</Label>
                <Input
                  id="stock"
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                  placeholder="0"
                />
              </div>

              <div>
                <Label htmlFor="product-description">Deskripsi</Label>
                <Textarea
                  id="product-description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Deskripsikan produk Anda..."
                  rows={3}
                />
              </div>

              <Button onClick={handleAddProduct} className="w-full">
                Simpan Produk
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Product Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <Button className="hidden" />
          </DialogTrigger>
          <DialogContent className="max-w-sm max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Produk</DialogTitle>
              <DialogDescription>Perbarui detail produk Anda.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="product-name">Nama Produk</Label>
                <Input
                  id="product-name"
                  value={editingProduct?.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct!, name: e.target.value })}
                  placeholder="Contoh: Keripik Singkong"
                />
              </div>

              <div>
                <Label htmlFor="category">Kategori</Label>
                <Select value={editingProduct?.category || ''} onValueChange={(value) => setEditingProduct({ ...editingProduct!, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Makanan">Makanan</SelectItem>
                    <SelectItem value="Minuman">Minuman</SelectItem>
                    <SelectItem value="Kue">Kue</SelectItem>
                    <SelectItem value="Kerajinan">Kerajinan</SelectItem>
                    <SelectItem value="Lainnya">Lainnya</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="price">Harga (Rp)</Label>
                <Input
                  id="price"
                  type="number"
                  value={editingProduct?.price.toString() || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct!, price: parseFloat(e.target.value) })}
                  placeholder="0"
                />
              </div>

              <div>
                <Label htmlFor="stock">Stok</Label>
                <Input
                  id="stock"
                  type="number"
                  value={editingProduct?.stock.toString() || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct!, stock: parseInt(e.target.value) })}
                  placeholder="0"
                />
              </div>

              <div>
                <Label htmlFor="product-description">Deskripsi</Label>
                <Textarea
                  id="product-description"
                  value={editingProduct?.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct!, description: e.target.value })}
                  placeholder="Deskripsikan produk Anda..."
                  rows={3}
                />
              </div>

              <Button onClick={handleSaveEdit} className="w-full">
                Simpan Perubahan
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Category Filter */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
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
        <div className="space-y-4">
          {filteredProducts.map((product) => {
            const priceRec = getPriceRecommendation(product);
            
            return (
              <Card key={product.id} className="overflow-hidden">
                <div className="flex gap-4 p-4">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="mb-1">{product.name}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {product.category}
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleEditProduct(product)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600" onClick={() => handleDeleteProduct(product.id, product.name)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                    
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-green-600 mb-1">Rp {product.price.toLocaleString('id-ID')}</p>
                        <p className="text-xs text-gray-500">Stok: {product.stock}</p>
                      </div>
                      
                      {priceRec && (
                        <div className="text-right">
                          {priceRec.isCompetitive ? (
                            <Badge className="bg-green-100 text-green-700 text-xs">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Harga Kompetitif
                            </Badge>
                          ) : priceRec.isCheap ? (
                            <Badge className="bg-blue-100 text-blue-700 text-xs">
                              <DollarSign className="w-3 h-3 mr-1" />
                              Di Bawah Pasar
                            </Badge>
                          ) : (
                            <Badge className="bg-orange-100 text-orange-700 text-xs">
                              Di Atas Pasar
                            </Badge>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            Pasar: Rp {product.marketPriceMin?.toLocaleString('id-ID')} - {product.marketPriceMax?.toLocaleString('id-ID')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Tidak ada produk ditemukan</p>
          </div>
        )}
      </div>
    </div>
  );
}