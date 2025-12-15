import { ArrowLeft, Lightbulb, TrendingUp, Users, Target, Smartphone, BookOpen, ChevronRight } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

interface TipsProps {
  onClose: () => void;
}

interface Tip {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  readTime: string;
  icon: any;
  color: string;
}

export function Tips({ onClose }: TipsProps) {
  const tips: Tip[] = [
    {
      id: '1',
      title: '5 Cara Meningkatkan Penjualan Online',
      category: 'Pemasaran',
      excerpt: 'Pelajari strategi efektif untuk meningkatkan penjualan produk Anda di marketplace',
      readTime: '3 menit',
      icon: TrendingUp,
      color: 'bg-green-100 text-green-600',
    },
    {
      id: '2',
      title: 'Tips Foto Produk yang Menarik Pembeli',
      category: 'Fotografi',
      excerpt: 'Foto produk yang berkualitas dapat meningkatkan minat pembeli hingga 70%',
      readTime: '5 menit',
      icon: Smartphone,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      id: '3',
      title: 'Cara Menentukan Harga Jual yang Tepat',
      category: 'Strategi Harga',
      excerpt: 'Temukan cara menghitung harga jual yang kompetitif namun tetap menguntungkan',
      readTime: '4 menit',
      icon: Target,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      id: '4',
      title: 'Membangun Kepercayaan Pelanggan',
      category: 'Customer Service',
      excerpt: 'Pelayanan yang baik adalah kunci untuk mendapatkan pelanggan setia',
      readTime: '6 menit',
      icon: Users,
      color: 'bg-orange-100 text-orange-600',
    },
    {
      id: '5',
      title: 'Mengelola Keuangan Bisnis dengan Baik',
      category: 'Keuangan',
      excerpt: 'Pentingnya mencatat setiap pemasukan dan pengeluaran untuk bisnis yang sehat',
      readTime: '5 menit',
      icon: BookOpen,
      color: 'bg-pink-100 text-pink-600',
    },
  ];

  const categories = ['Semua', 'Pemasaran', 'Fotografi', 'Strategi Harga', 'Customer Service', 'Keuangan'];

  const handleReadTip = (tipTitle: string) => {
    toast.info(`Membuka artikel: ${tipTitle}`);
    // Di aplikasi lengkap, ini akan membuka halaman detail tips
  };

  const handleFilterCategory = (category: string) => {
    toast.info(`Filter tips: ${category}`);
    // Di aplikasi lengkap, ini akan filter tips berdasarkan kategori
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-orange-700 text-white p-4 z-10">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onClose}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="flex-1">Tips Bisnis</h2>
        </div>
        <p className="text-sm text-orange-100">Tingkatkan bisnis Anda dengan tips praktis</p>
      </div>

      {/* Featured Tip */}
      <div className="p-4">
        <Card className="overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <Badge className="bg-white/20 text-white mb-3">Tips Populer</Badge>
            <h3 className="mb-2 text-white">Cara Memulai Bisnis Online dari Nol</h3>
            <p className="text-sm text-blue-100 mb-4">
              Panduan lengkap untuk memulai bisnis online tanpa modal besar
            </p>
            <div className="flex items-center gap-4 text-sm">
              <span>📚 8 menit</span>
              <span>👁️ 1.2k views</span>
            </div>
          </div>
        </Card>

        {/* Categories */}
        <div className="mb-6">
          <h3 className="mb-3">Kategori</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant="outline"
                className="whitespace-nowrap cursor-pointer hover:bg-gray-100"
                onClick={() => handleFilterCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Tips List */}
        <div>
          <h3 className="mb-3">Semua Tips</h3>
          <div className="space-y-3">
            {tips.map((tip) => {
              const Icon = tip.icon;
              return (
                <Card key={tip.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleReadTip(tip.title)}>
                  <div className="flex gap-4">
                    <div className={`p-3 rounded-lg ${tip.color} flex-shrink-0`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="line-clamp-2 pr-2">{tip.title}</h3>
                        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{tip.excerpt}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <Badge variant="secondary" className="text-xs">
                          {tip.category}
                        </Badge>
                        <span>⏱️ {tip.readTime}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Daily Tip */}
        <Card className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-orange-200">
          <div className="flex gap-3">
            <Lightbulb className="w-6 h-6 text-orange-600 flex-shrink-0" />
            <div>
              <p className="mb-1">💡 Tips Hari Ini</p>
              <p className="text-sm text-gray-600">
                Balas pesan pelanggan dalam waktu kurang dari 1 jam untuk meningkatkan kepercayaan dan kemungkinan pembelian!
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}