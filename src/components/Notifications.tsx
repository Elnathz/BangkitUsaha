import { ArrowLeft, Bell, ShoppingBag, TrendingUp, MessageCircle, AlertCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface NotificationsProps {
  onClose: () => void;
}

type NotificationType = 'order' | 'financial' | 'message' | 'reminder';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

export function Notifications({ onClose }: NotificationsProps) {
  const notifications: Notification[] = [
    {
      id: '1',
      type: 'order',
      title: 'Pesanan Baru',
      message: 'Anda menerima pesanan baru dari Budi Santoso senilai Rp 75.000',
      time: '5 menit lalu',
      isRead: false,
    },
    {
      id: '2',
      type: 'message',
      title: 'Pesan Baru',
      message: 'Siti Aminah mengirim pesan: "Apakah produk ready stock?"',
      time: '15 menit lalu',
      isRead: false,
    },
    {
      id: '3',
      type: 'reminder',
      title: 'Pengingat Catatan Keuangan',
      message: 'Jangan lupa catat transaksi hari ini untuk laporan yang akurat',
      time: '1 jam lalu',
      isRead: false,
    },
    {
      id: '4',
      type: 'financial',
      title: 'Pencapaian Penjualan',
      message: 'Selamat! Penjualan minggu ini naik 12.5% dari minggu lalu',
      time: '2 jam lalu',
      isRead: true,
    },
    {
      id: '5',
      type: 'order',
      title: 'Pesanan Selesai',
      message: 'Pesanan #ORD-002 telah diselesaikan',
      time: '3 jam lalu',
      isRead: true,
    },
  ];

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'order':
        return ShoppingBag;
      case 'financial':
        return TrendingUp;
      case 'message':
        return MessageCircle;
      case 'reminder':
        return AlertCircle;
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case 'order':
        return 'bg-blue-100 text-blue-600';
      case 'financial':
        return 'bg-green-100 text-green-600';
      case 'message':
        return 'bg-purple-100 text-purple-600';
      case 'reminder':
        return 'bg-orange-100 text-orange-600';
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b p-4 flex items-center gap-3 z-10">
        <button onClick={onClose}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="flex-1">Notifikasi</h2>
        {unreadCount > 0 && (
          <Badge className="bg-red-500">{unreadCount} baru</Badge>
        )}
      </div>

      {/* Notifications List */}
      <div className="p-4 space-y-3">
        {notifications.map((notification) => {
          const Icon = getNotificationIcon(notification.type);
          const colorClass = getNotificationColor(notification.type);

          return (
            <Card 
              key={notification.id} 
              className={`p-4 ${!notification.isRead ? 'bg-blue-50 border-blue-200' : ''}`}
            >
              <div className="flex gap-3">
                <div className={`p-2 rounded-full ${colorClass} flex-shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <p className={!notification.isRead ? '' : 'text-gray-700'}>
                      {notification.title}
                    </p>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                  <p className="text-xs text-gray-500">{notification.time}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {notifications.length === 0 && (
        <div className="text-center py-12">
          <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Tidak ada notifikasi</p>
        </div>
      )}
    </div>
  );
}
