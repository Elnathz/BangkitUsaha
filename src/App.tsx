import { useState, useEffect } from 'react';
import { Home, Wallet, Package, ShoppingCart, User } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { Transactions } from './components/Transactions';
import { Products } from './components/Products';
import { Orders } from './components/Orders';
import { Profile } from './components/Profile';
import { Onboarding } from './components/Onboarding';
import { Toaster } from './components/ui/sonner';

type TabType = 'dashboard' | 'transactions' | 'products' | 'orders' | 'profile';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [showOnboarding, setShowOnboarding] = useState(true);

  useEffect(() => {
    // Check if user has seen onboarding
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (hasSeenOnboarding) {
      setShowOnboarding(false);
    }
  }, []);

  const handleCompleteOnboarding = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
  };

  if (showOnboarding) {
    return <Onboarding onComplete={handleCompleteOnboarding} />;
  }

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Beranda', icon: Home },
    { id: 'transactions' as TabType, label: 'Transaksi', icon: Wallet },
    { id: 'products' as TabType, label: 'Produk', icon: Package },
    { id: 'orders' as TabType, label: 'Pesanan', icon: ShoppingCart },
    { id: 'profile' as TabType, label: 'Profil', icon: User },
  ];

  return (
    <>
      <div className="flex flex-col h-screen bg-gray-50 max-w-md mx-auto">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto pb-20">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'transactions' && <Transactions />}
          {activeTab === 'products' && <Products />}
          {activeTab === 'orders' && <Orders />}
          {activeTab === 'profile' && <Profile />}
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 max-w-md mx-auto">
          <div className="flex justify-around items-center h-16 px-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                    isActive ? 'text-blue-600' : 'text-gray-500'
                  }`}
                >
                  <Icon className={`w-6 h-6 ${isActive ? 'fill-blue-600' : ''}`} />
                  <span className="text-xs mt-1">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <Toaster position="top-center" richColors />
    </>
  );
}