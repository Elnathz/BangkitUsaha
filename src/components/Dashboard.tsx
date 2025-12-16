import { useState, useEffect } from "react";
import {
    Bell,
    MessageCircle,
    TrendingUp,
    TrendingDown,
    ShoppingBag,
    Package,
    Lightbulb,
    Search,
    ArrowUpRight,
    ArrowDownRight,
    Users,
    Wifi,
    WifiOff,
} from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Notifications } from "./Notifications";
import { Chat } from "./Chat";
import { Tips } from "./Tips";
import { Catalog } from "./Catalog";
import { Community } from "./Community";
import { toast } from "sonner";

export function Dashboard() {
    const [showNotifications, setShowNotifications] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [showTips, setShowTips] = useState(false);
    const [showCatalog, setShowCatalog] = useState(false);
    const [showCommunity, setShowCommunity] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month">(
        "week"
    );
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

    // --- LOGIKA BARU: Data Real-time & Status Sinyal ---
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [transactions, setTransactions] = useState<any[]>([]);

    useEffect(() => {
        // 1. Cek Status Online/Offline
        const handleStatusChange = () => setIsOnline(navigator.onLine);
        window.addEventListener("online", handleStatusChange);
        window.addEventListener("offline", handleStatusChange);

        // 2. Ambil Data Real dari LocalStorage
        const storedData = localStorage.getItem("bangkit-transactions");
        if (storedData) {
            try {
                setTransactions(JSON.parse(storedData));
            } catch (e) {
                console.error("Gagal memuat data", e);
            }
        }

        return () => {
            window.removeEventListener("online", handleStatusChange);
            window.removeEventListener("offline", handleStatusChange);
        };
    }, []);

    // Hitung Pendapatan Real dari Transaksi
    const totalRealRevenue = transactions
        .filter((t: any) => t.type === "income")
        .reduce((sum: number, t: any) => sum + t.amount, 0);

    const transactionCount = transactions.length;
    // ----------------------------------------------------

    // Data Visual (Digabung dengan data real)
    const weeklyData = {
        revenue: totalRealRevenue, // Menggunakan Data Real
        revenueChange: 12.5,
        orders: transactionCount, // Menggunakan Data Real
        ordersChange: 8,
        products: 15,
        newCustomers: 12,
    };

    const monthlyData = {
        revenue: totalRealRevenue, // Menggunakan Data Real
        revenueChange: 15.3,
        orders: transactionCount, // Menggunakan Data Real
        ordersChange: 12,
        products: 15,
        newCustomers: 42,
    };

    const data = selectedPeriod === "week" ? weeklyData : monthlyData;

    // Data Pesanan Terbaru (Hardcoded untuk tampilan, bisa diganti data real nanti)
    const recentOrders = [
        {
            id: "001",
            customer: "Budi Santoso",
            product: "Keripik Singkong",
            amount: 75000,
            status: "pending",
        },
        {
            id: "002",
            customer: "Siti Aminah",
            product: "Sambal Matah",
            amount: 45000,
            status: "completed",
        },
        {
            id: "003",
            customer: "Ahmad Yani",
            product: "Kue Lapis",
            amount: 120000,
            status: "processing",
        },
    ];

    if (showNotifications)
        return <Notifications onClose={() => setShowNotifications(false)} />;
    if (showChat) return <Chat onClose={() => setShowChat(false)} />;
    if (showTips) return <Tips onClose={() => setShowTips(false)} />;
    if (showCatalog) return <Catalog onClose={() => setShowCatalog(false)} />;
    if (showCommunity)
        return <Community onClose={() => setShowCommunity(false)} />;

    const handleViewAllOrders = () => {
        toast.info("Menampilkan semua pesanan...");
    };

    const handleViewOrderDetail = (orderId: string) => {
        setSelectedOrderId(orderId);
        toast.success(`Melihat detail pesanan ${orderId}`);
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 pb-8">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="mb-1 text-xl font-bold">
                            Bangkit Usaha
                        </h1>
                        <p className="text-blue-100 text-sm">
                            Selamat datang kembali! 👋
                        </p>

                        {/* INDIKATOR SINYAL (Ditambahkan Rapi di sini) */}
                        <div
                            className={`flex items-center gap-2 text-[10px] px-2 py-0.5 rounded-full w-fit mt-2 ${
                                isOnline
                                    ? "bg-green-500/30 text-white border border-green-400/50"
                                    : "bg-red-500/30 text-white border border-red-400/50"
                            }`}
                        >
                            {isOnline ? (
                                <Wifi className="w-3 h-3" />
                            ) : (
                                <WifiOff className="w-3 h-3" />
                            )}
                            <span>{isOnline ? "Online" : "Offline Mode"}</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowNotifications(true)}
                            className="relative p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                        >
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <button
                            onClick={() => setShowChat(true)}
                            className="relative p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                        >
                            <MessageCircle className="w-5 h-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                    </div>
                </div>

                {/* Period Selector */}
                <div className="flex gap-2 bg-white/10 rounded-lg p-1">
                    <button
                        onClick={() => setSelectedPeriod("week")}
                        className={`flex-1 py-2 rounded-md transition-colors ${
                            selectedPeriod === "week"
                                ? "bg-white text-blue-600"
                                : "text-white"
                        }`}
                    >
                        Mingguan
                    </button>
                    <button
                        onClick={() => setSelectedPeriod("month")}
                        className={`flex-1 py-2 rounded-md transition-colors ${
                            selectedPeriod === "month"
                                ? "bg-white text-blue-600"
                                : "text-white"
                        }`}
                    >
                        Bulanan
                    </button>
                </div>
            </div>

            <div className="px-4 -mt-4 pb-6">
                {/* Revenue Card (Sekarang menggunakan DATA REAL) */}
                <Card className="p-4 mb-4 shadow-md">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">
                                Total Pendapatan
                            </p>
                            <h2 className="text-green-600 text-2xl font-bold">
                                Rp {data.revenue.toLocaleString("id-ID")}
                            </h2>
                        </div>
                        <div
                            className={`flex items-center gap-1 ${
                                data.revenueChange > 0
                                    ? "text-green-600"
                                    : "text-red-600"
                            }`}
                        >
                            {data.revenueChange > 0 ? (
                                <ArrowUpRight className="w-4 h-4" />
                            ) : (
                                <ArrowDownRight className="w-4 h-4" />
                            )}
                            <span className="text-sm">
                                {data.revenueChange}%
                            </span>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500">
                        {selectedPeriod === "week"
                            ? "Data berdasarkan input transaksi"
                            : "Data akumulasi bulanan"}
                    </p>
                </Card>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    <Card className="p-3 text-center">
                        <ShoppingBag className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                        <p className="text-xs text-gray-600 mb-1">Transaksi</p>
                        <p className="text-blue-600 font-bold">{data.orders}</p>
                    </Card>
                    <Card className="p-3 text-center">
                        <Package className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                        <p className="text-xs text-gray-600 mb-1">Produk</p>
                        <p className="text-purple-600 font-bold">
                            {data.products}
                        </p>
                    </Card>
                    <Card className="p-3 text-center">
                        <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
                        <p className="text-xs text-gray-600 mb-1">Pelanggan</p>
                        <p className="text-green-600 font-bold">
                            {data.newCustomers}
                        </p>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="mb-6">
                    <h3 className="mb-3 font-semibold text-gray-800">
                        Akses Cepat
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                        <Button
                            variant="outline"
                            className="h-auto py-4 flex flex-col gap-2"
                            onClick={() => setShowCatalog(true)}
                        >
                            <Search className="w-6 h-6 text-blue-600" />
                            <span className="text-xs">Cari Produk</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-auto py-4 flex flex-col gap-2"
                            onClick={() => setShowCommunity(true)}
                        >
                            <Users className="w-6 h-6 text-indigo-600" />
                            <span className="text-xs">Komunitas</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-auto py-4 flex flex-col gap-2"
                            onClick={() => setShowTips(true)}
                        >
                            <Lightbulb className="w-6 h-6 text-orange-600" />
                            <span className="text-xs">Tips Bisnis</span>
                        </Button>
                    </div>
                </div>

                {/* Recent Orders (Tampilan Tetap) */}
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold text-gray-800">
                            Pesanan Terbaru
                        </h3>
                        <button
                            className="text-sm text-blue-600"
                            onClick={handleViewAllOrders}
                        >
                            Lihat Semua
                        </button>
                    </div>
                    <div className="space-y-3">
                        {recentOrders.map((order) => (
                            <Card key={order.id} className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="mb-1 font-medium">
                                            {order.customer}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {order.product}
                                        </p>
                                    </div>
                                    <Badge
                                        variant={
                                            order.status === "completed"
                                                ? "default"
                                                : "secondary"
                                        }
                                        className={
                                            order.status === "completed"
                                                ? "bg-green-100 text-green-700 hover:bg-green-100"
                                                : order.status === "processing"
                                                ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                                                : "bg-orange-100 text-orange-700 hover:bg-orange-100"
                                        }
                                        onClick={() =>
                                            handleViewOrderDetail(order.id)
                                        }
                                    >
                                        {order.status === "completed"
                                            ? "Selesai"
                                            : order.status === "processing"
                                            ? "Proses"
                                            : "Pending"}
                                    </Badge>
                                </div>
                                <p className="text-green-600 font-bold">
                                    Rp {order.amount.toLocaleString("id-ID")}
                                </p>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
