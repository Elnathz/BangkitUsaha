import { useState, useEffect } from "react";
import { Package, Clock, CheckCircle, XCircle } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

// Firebase
import { db, auth } from "../lib/firebase";
import {
    collection,
    onSnapshot,
    query,
    where,
    orderBy,
} from "firebase/firestore";

export function Orders() {
    const [activeTab, setActiveTab] = useState("buying"); // 'buying' or 'selling'
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const currentUser = auth.currentUser;

    useEffect(() => {
        if (!currentUser) return;

        // Query berdasarkan Tab Aktif
        // Jika 'buying': Cari order dimana saya adalah buyerId
        // Jika 'selling': Cari order dimana saya adalah sellerId
        const roleField = activeTab === "buying" ? "buyerId" : "sellerId";

        const q = query(
            collection(db, "orders"),
            where(roleField, "==", currentUser.uid),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setOrders(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser, activeTab]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-orange-100 text-orange-700";
            case "processing":
                return "bg-blue-100 text-blue-700";
            case "completed":
                return "bg-green-100 text-green-700";
            case "cancelled":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100";
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-24">
            <div className="bg-white p-4 border-b">
                <h1 className="font-bold text-xl mb-4">Pesanan</h1>
                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                >
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="buying">Pembelian Saya</TabsTrigger>
                        <TabsTrigger value="selling">
                            Penjualan Saya
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="p-4 space-y-3">
                {loading ? (
                    <p className="text-center text-gray-400 mt-4">
                        Memuat data...
                    </p>
                ) : orders.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">
                        <Package className="w-12 h-12 mx-auto mb-2 opacity-30" />
                        <p>
                            Belum ada riwayat{" "}
                            {activeTab === "buying" ? "pembelian" : "penjualan"}
                            .
                        </p>
                    </div>
                ) : (
                    orders.map((order) => (
                        <Card key={order.id} className="p-4">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <p className="font-bold text-sm">
                                        {order.productName}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {activeTab === "buying"
                                            ? `Penjual: ${order.sellerName}`
                                            : `Pembeli: ${order.buyerName}`}
                                    </p>
                                </div>
                                <Badge
                                    className={getStatusColor(order.status)}
                                    variant="outline"
                                >
                                    {order.status}
                                </Badge>
                            </div>

                            <div className="flex justify-between text-sm mb-2 text-gray-600">
                                <span>
                                    {order.quantity} x Rp{" "}
                                    {order.price.toLocaleString()}
                                </span>
                                <span className="font-bold text-black">
                                    Total: Rp {order.total.toLocaleString()}
                                </span>
                            </div>

                            <div className="pt-2 border-t text-xs text-gray-400 flex justify-between items-center">
                                <span>{order.paymentMethod}</span>
                                <span>
                                    {order.createdAt
                                        ?.toDate()
                                        .toLocaleDateString("id-ID")}
                                </span>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
