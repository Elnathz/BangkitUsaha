import { useState } from 'react';
import { Package, Clock, CheckCircle, XCircle, Eye, MessageCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';
type PaymentMethod = 'cod' | 'transfer';

interface Order {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentProof?: string;
  date: string;
  notes?: string;
}

export function Orders() {
  const [selectedTab, setSelectedTab] = useState<'all' | OrderStatus>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      orderNumber: 'ORD-001',
      customer: {
        name: 'Budi Santoso',
        phone: '081234567890',
        address: 'Jl. Merdeka No. 123, Jakarta',
      },
      items: [
        { name: 'Keripik Singkong Original', quantity: 3, price: 25000 },
        { name: 'Sambal Matah', quantity: 1, price: 35000 },
      ],
      total: 110000,
      status: 'pending',
      paymentMethod: 'transfer',
      date: '2025-12-03T10:30:00',
      notes: 'Mohon dikemas rapi',
    },
    {
      id: '2',
      orderNumber: 'ORD-002',
      customer: {
        name: 'Siti Aminah',
        phone: '081234567891',
        address: 'Jl. Sudirman No. 45, Bandung',
      },
      items: [
        { name: 'Kue Lapis Legit', quantity: 1, price: 150000 },
      ],
      total: 150000,
      status: 'processing',
      paymentMethod: 'cod',
      date: '2025-12-02T14:20:00',
    },
    {
      id: '3',
      orderNumber: 'ORD-003',
      customer: {
        name: 'Ahmad Yani',
        phone: '081234567892',
        address: 'Jl. Gatot Subroto No. 78, Surabaya',
      },
      items: [
        { name: 'Keripik Singkong Original', quantity: 5, price: 25000 },
      ],
      total: 125000,
      status: 'completed',
      paymentMethod: 'transfer',
      date: '2025-12-01T09:15:00',
    },
  ]);

  const getStatusInfo = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return { label: 'Menunggu', color: 'bg-orange-100 text-orange-700', icon: Clock };
      case 'processing':
        return { label: 'Diproses', color: 'bg-blue-100 text-blue-700', icon: Package };
      case 'completed':
        return { label: 'Selesai', color: 'bg-green-100 text-green-700', icon: CheckCircle };
      case 'cancelled':
        return { label: 'Dibatalkan', color: 'bg-red-100 text-red-700', icon: XCircle };
    }
  };

  const filteredOrders = orders.filter(order => {
    if (selectedTab === 'all') return true;
    return order.status === selectedTab;
  });

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const handleViewDetail = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  const orderCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    completed: orders.filter(o => o.status === 'completed').length,
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white p-6 pb-4">
        <h1 className="mb-4">Kelola Pesanan</h1>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as any)} className="px-4">
          <TabsList className="w-full grid grid-cols-4 h-auto">
            <TabsTrigger value="all" className="py-3 flex flex-col gap-1">
              <span>Semua</span>
              <Badge variant="secondary" className="text-xs">{orderCounts.all}</Badge>
            </TabsTrigger>
            <TabsTrigger value="pending" className="py-3 flex flex-col gap-1">
              <span>Baru</span>
              <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700">{orderCounts.pending}</Badge>
            </TabsTrigger>
            <TabsTrigger value="processing" className="py-3 flex flex-col gap-1">
              <span>Proses</span>
              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">{orderCounts.processing}</Badge>
            </TabsTrigger>
            <TabsTrigger value="completed" className="py-3 flex flex-col gap-1">
              <span>Selesai</span>
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">{orderCounts.completed}</Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Orders List */}
      <div className="p-4 space-y-3 pb-6">
        {filteredOrders.map((order) => {
          const statusInfo = getStatusInfo(order.status);
          const StatusIcon = statusInfo.icon;

          return (
            <Card key={order.id} className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="mb-1">{order.orderNumber}</p>
                  <p className="text-sm text-gray-600">{order.customer.name}</p>
                </div>
                <Badge className={statusInfo.color}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {statusInfo.label}
                </Badge>
              </div>

              <div className="space-y-2 mb-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.quantity}x {item.name}
                    </span>
                    <span>Rp {(item.quantity * item.price).toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-3 border-t">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total</p>
                  <p className="text-green-600">Rp {order.total.toLocaleString('id-ID')}</p>
                  <Badge variant="outline" className="text-xs mt-1">
                    {order.paymentMethod === 'cod' ? 'COD' : 'Transfer'}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewDetail(order)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Tidak ada pesanan</p>
          </div>
        )}
      </div>

      {/* Order Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-sm max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Pesanan</DialogTitle>
            <DialogDescription>Informasi lengkap tentang pesanan ini.</DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-4 py-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Nomor Pesanan</p>
                <p>{selectedOrder.orderNumber}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <Badge className={getStatusInfo(selectedOrder.status).color}>
                  {getStatusInfo(selectedOrder.status).label}
                </Badge>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Tanggal Pesanan</p>
                <p>{new Date(selectedOrder.date).toLocaleString('id-ID')}</p>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-2">Informasi Pelanggan</p>
                <p className="mb-1">{selectedOrder.customer.name}</p>
                <p className="text-sm text-gray-600 mb-1">{selectedOrder.customer.phone}</p>
                <p className="text-sm text-gray-600">{selectedOrder.customer.address}</p>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-2">Item Pesanan</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-sm">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="text-sm">Rp {(item.quantity * item.price).toLocaleString('id-ID')}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <p className="text-sm text-gray-600">Metode Pembayaran</p>
                  <Badge variant="outline">
                    {selectedOrder.paymentMethod === 'cod' ? 'COD' : 'Transfer Bank'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <p>Total</p>
                  <p className="text-green-600">Rp {selectedOrder.total.toLocaleString('id-ID')}</p>
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600 mb-1">Catatan</p>
                  <p className="text-sm">{selectedOrder.notes}</p>
                </div>
              )}

              <div className="border-t pt-4 space-y-2">
                <p className="text-sm text-gray-600 mb-2">Update Status</p>
                <div className="grid grid-cols-2 gap-2">
                  {selectedOrder.status === 'pending' && (
                    <>
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateStatus(selectedOrder.id, 'processing')}
                      >
                        Proses
                      </Button>
                      <Button 
                        variant="outline"
                        size="sm"
                        className="text-red-600"
                        onClick={() => handleUpdateStatus(selectedOrder.id, 'cancelled')}
                      >
                        Tolak
                      </Button>
                    </>
                  )}
                  {selectedOrder.status === 'processing' && (
                    <Button 
                      size="sm"
                      className="col-span-2"
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'completed')}
                    >
                      Selesaikan Pesanan
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}