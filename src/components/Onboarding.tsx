import { useState } from 'react';
import { ChevronRight, TrendingUp, Package, ShoppingBag, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';

interface OnboardingProps {
  onComplete: () => void;
}

const slides = [
  {
    icon: TrendingUp,
    title: 'Kelola Bisnis Lebih Mudah',
    description: 'Catat keuangan, kelola produk, dan pantau penjualan dalam satu aplikasi',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    icon: Package,
    title: 'Jual Produk Online',
    description: 'Upload produk dan jangkau lebih banyak pembeli di marketplace',
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  {
    icon: ShoppingBag,
    title: 'Kelola Pesanan',
    description: 'Terima dan proses pesanan dengan mudah dari satu tempat',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    icon: MessageCircle,
    title: 'Chat dengan Pembeli',
    description: 'Komunikasi langsung dengan pelanggan untuk meningkatkan penjualan',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
];

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="flex flex-col h-screen bg-white max-w-md mx-auto">
      <div className="flex justify-end p-4">
        <button onClick={handleSkip} className="text-gray-500">
          Lewati
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 pb-12">
        <div className={`${slide.bg} rounded-full p-8 mb-8`}>
          <Icon className={`w-24 h-24 ${slide.color}`} />
        </div>

        <h2 className="text-center mb-4">{slide.title}</h2>
        <p className="text-center text-gray-600 mb-12">{slide.description}</p>

        {/* Pagination dots */}
        <div className="flex gap-2 mb-8">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide ? 'w-8 bg-blue-600' : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="p-6">
        <Button onClick={handleNext} className="w-full" size="lg">
          {currentSlide < slides.length - 1 ? (
            <>
              Selanjutnya
              <ChevronRight className="ml-2 w-5 h-5" />
            </>
          ) : (
            'Mulai Sekarang'
          )}
        </Button>
      </div>
    </div>
  );
}
