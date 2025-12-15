import { useState } from 'react';
import { Plus, ArrowDownRight, ArrowUpRight, Calendar, Filter, Download } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';

type TransactionType = 'income' | 'expense';

interface Transaction {
  id: string;
  type: TransactionType;
  category: string;
  amount: number;
  description: string;
  date: string;
}

export function Transactions() {
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    type: 'income' as TransactionType,
    category: '',
    amount: '',
    description: '',
  });

  const [transactions, setTransactions] = useState<Transaction[]>([
    { 
      id: '1', 
      type: 'income', 
      category: 'Penjualan Produk', 
      amount: 250000, 
      description: 'Penjualan Keripik Singkong',
      date: '2025-12-03'
    },
    { 
      id: '2', 
      type: 'expense', 
      category: 'Bahan Baku', 
      amount: 150000, 
      description: 'Pembelian singkong 10kg',
      date: '2025-12-02'
    },
    { 
      id: '3', 
      type: 'income', 
      category: 'Penjualan Produk', 
      amount: 180000, 
      description: 'Penjualan Sambal Matah',
      date: '2025-12-02'
    },
    { 
      id: '4', 
      type: 'expense', 
      category: 'Operasional', 
      amount: 50000, 
      description: 'Biaya listrik',
      date: '2025-12-01'
    },
    { 
      id: '5', 
      type: 'income', 
      category: 'Penjualan Produk', 
      amount: 320000, 
      description: 'Penjualan Kue Lapis',
      date: '2025-12-01'
    },
  ]);

  const filteredTransactions = transactions.filter(t => {
    if (filter === 'all') return true;
    return t.type === filter;
  });

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const handleAddTransaction = () => {
    if (!newTransaction.category || !newTransaction.amount) return;

    const transaction: Transaction = {
      id: Date.now().toString(),
      type: newTransaction.type,
      category: newTransaction.category,
      amount: parseFloat(newTransaction.amount),
      description: newTransaction.description,
      date: new Date().toISOString().split('T')[0],
    };

    setTransactions([transaction, ...transactions]);
    setIsAddDialogOpen(false);
    setNewTransaction({
      type: 'income',
      category: '',
      amount: '',
      description: '',
    });
    toast.success('Transaksi berhasil ditambahkan');
  };

  const handleExportData = () => {
    toast.success('Data keuangan sedang diexport...');
    // Di aplikasi lengkap, ini akan export data ke CSV atau PDF
    setTimeout(() => {
      toast.info('Export selesai! File telah diunduh.');
    }, 1500);
  };

  const handleOpenFilter = () => {
    toast.info('Filter tanggal akan segera tersedia');
    // Di aplikasi lengkap, ini akan membuka dialog filter tanggal
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 pb-8">
        <h1 className="mb-6">Pencatatan Keuangan</h1>

        {/* Balance Summary */}
        <Card className="bg-white/10 backdrop-blur-sm border-0 text-white p-4 mb-4">
          <p className="text-sm text-green-100 mb-1">Saldo Saat Ini</p>
          <h2 className="mb-4">Rp {balance.toLocaleString('id-ID')}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-green-100 mb-1">
                <ArrowUpRight className="w-4 h-4" />
                <span>Pemasukan</span>
              </div>
              <p>Rp {totalIncome.toLocaleString('id-ID')}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-green-100 mb-1">
                <ArrowDownRight className="w-4 h-4" />
                <span>Pengeluaran</span>
              </div>
              <p>Rp {totalExpense.toLocaleString('id-ID')}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="px-4 -mt-4 pb-6">
        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="h-auto py-4 flex flex-col gap-2">
                <Plus className="w-5 h-5" />
                <span className="text-xs">Tambah</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>Tambah Transaksi</DialogTitle>
                <DialogDescription>Tambahkan transaksi baru ke pencatatan keuangan Anda.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label>Jenis Transaksi</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Button
                      type="button"
                      variant={newTransaction.type === 'income' ? 'default' : 'outline'}
                      onClick={() => setNewTransaction({ ...newTransaction, type: 'income' })}
                      className="w-full"
                    >
                      <ArrowUpRight className="w-4 h-4 mr-2" />
                      Pemasukan
                    </Button>
                    <Button
                      type="button"
                      variant={newTransaction.type === 'expense' ? 'default' : 'outline'}
                      onClick={() => setNewTransaction({ ...newTransaction, type: 'expense' })}
                      className="w-full"
                    >
                      <ArrowDownRight className="w-4 h-4 mr-2" />
                      Pengeluaran
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="category">Kategori</Label>
                  <Input
                    id="category"
                    value={newTransaction.category}
                    onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                    placeholder="Contoh: Penjualan Produk"
                  />
                </div>

                <div>
                  <Label htmlFor="amount">Jumlah (Rp)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                    placeholder="0"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Keterangan (Opsional)</Label>
                  <Textarea
                    id="description"
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                    placeholder="Tambahkan keterangan..."
                    rows={3}
                  />
                </div>

                <Button onClick={handleAddTransaction} className="w-full">
                  Simpan Transaksi
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={handleExportData}>
            <Download className="w-5 h-5" />
            <span className="text-xs">Export</span>
          </Button>

          <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={handleOpenFilter}>
            <Calendar className="w-5 h-5" />
            <span className="text-xs">Filter</span>
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            Semua
          </Button>
          <Button
            variant={filter === 'income' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('income')}
            className={filter === 'income' ? 'bg-green-600' : ''}
          >
            <ArrowUpRight className="w-4 h-4 mr-1" />
            Pemasukan
          </Button>
          <Button
            variant={filter === 'expense' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('expense')}
            className={filter === 'expense' ? 'bg-red-600' : ''}
          >
            <ArrowDownRight className="w-4 h-4 mr-1" />
            Pengeluaran
          </Button>
        </div>

        {/* Transactions List */}
        <div className="space-y-3">
          {filteredTransactions.map((transaction) => (
            <Card key={transaction.id} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${
                    transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.type === 'income' ? (
                      <ArrowUpRight className="w-5 h-5 text-green-600" />
                    ) : (
                      <ArrowDownRight className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="mb-1">{transaction.category}</p>
                    <p className="text-sm text-gray-600">{transaction.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(transaction.date).toLocaleDateString('id-ID', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
                <p className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                  {transaction.type === 'income' ? '+' : '-'}Rp {transaction.amount.toLocaleString('id-ID')}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Tidak ada transaksi</p>
          </div>
        )}
      </div>
    </div>
  );
}