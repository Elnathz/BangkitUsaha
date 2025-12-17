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

// Import Dialog UI Component yang benar (sesuai struktur project)
import {
    Dialog as ShadDialog,
    DialogContent as ShadContent,
    DialogHeader as ShadHeader,
    DialogTitle as ShadTitle,
} from "./ui/dialog";
import {
    Select as ShadSelect,
    SelectContent as ShadSelectContent,
    SelectItem as ShadSelectItem,
    SelectTrigger as ShadSelectTrigger,
    SelectValue as ShadSelectValue,
} from "./ui/select";

// Firebase
import { db } from "../lib/firebase";
import {
    collection,
    addDoc,
    onSnapshot,
    query,
    where,
    Timestamp,
    getDocs,
} from "firebase/firestore";

// Simulasi ID User (Sama dengan MyStore)
const currentUserId = "user-petani-001";
const currentUserName = "Pak Tani (Saya)";

export function Products() {
    const [products, setProducts] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    // Checkout State
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [quantity, setQuantity] = useState(1);

    // 1. READ MARKETPLACE (Tampilkan barang orang lain)
    useEffect(() => {
        // Di aplikasi real, gunakan where("sellerId", "!=", currentUserId)
        // Tapi karena Firestore basic index limit, kita filter di client side untuk MVP ini
        const q = query(collection(db, "products"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs
                .map((doc) => ({ id: doc.id, ...doc.data() }))
                // Filter: Jangan tampilkan barang jualan saya sendiri di sini
                .filter((item: any) => item.sellerId !== currentUserId);

            setProducts(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // 2. CHECKOUT -> KE CHAT
    const handleCheckout = async () => {
        if (!paymentMethod) {
            toast.error("Pilih metode pembayaran");
            return;
        }

        const total = selectedProduct.price * quantity;
        const toastId = toast.loading("Menghubungi penjual...");

        try {
            // Logic Chat Room:
            // Cek apakah saya sudah pernah chat dengan penjual ini?
            const chatsRef = collection(db, "chats");
            // Cari chat yang saya terlibat
            const q = query(
                chatsRef,
                where("participants", "array-contains", currentUserId)
            );
            const snapshot = await getDocs(q);

            let chatRoomId = "";

            // Filter manual untuk mencari yang lawan bicaranya adalah sellerId
            const existingChat = snapshot.docs.find((doc) => {
                const data = doc.data();
                return data.participants.includes(selectedProduct.sellerId);
            });

            if (existingChat) {
                chatRoomId = existingChat.id;
            } else {
                // Buat Room Baru
                const newChat = await addDoc(chatsRef, {
                    participants: [currentUserId, selectedProduct.sellerId],
                    participantNames: [
                        currentUserName,
                        selectedProduct.sellerName,
                    ],
                    lastMessage: "Pesanan Baru",
                    updatedAt: Timestamp.now(),
                    unreadCount: 1,
                });
                chatRoomId = newChat.id;
            }

            // Kirim Struk Pesanan ke Chat
            const messageText = `KONFIRMASI PESANAN 🛒\n\nItem: ${
                selectedProduct.name
            } (x${quantity})\nTotal: Rp ${total.toLocaleString()}\nMetode: ${paymentMethod}\n\nMohon diproses ya kak!`;

            await addDoc(collection(db, "chats", chatRoomId, "messages"), {
                text: messageText,
                senderId: currentUserId,
                createdAt: Timestamp.now(),
                isSystemMessage: true,
            });

            toast.dismiss(toastId);
            toast.success("Pesanan terkirim ke chat!");
            setIsCheckoutOpen(false);
        } catch (error) {
            console.error(error);
            toast.dismiss(toastId);
            toast.error("Gagal checkout");
        }
    };

    // Filter Search
    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-gray-50 min-h-screen pb-24">
            {/* Search Header */}
            <div className="bg-white p-4 sticky top-0 z-10 border-b shadow-sm">
                <h1 className="text-lg font-bold mb-3">Cari Produk</h1>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Mau beli apa hari ini?"
                        className="pl-9 bg-gray-100 border-none rounded-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Grid Produk */}
            <div className="p-4 grid grid-cols-2 gap-4">
                {loading ? (
                    <p className="text-gray-500 col-span-2 text-center">
                        Memuat pasar...
                    </p>
                ) : filteredProducts.length === 0 ? (
                    <p className="text-gray-500 col-span-2 text-center">
                        Tidak ada produk ditemukan.
                    </p>
                ) : (
                    filteredProducts.map((product) => (
                        <Card
                            key={product.id}
                            className="overflow-hidden border-none shadow-sm flex flex-col hover:shadow-md transition-shadow"
                        >
                            <div className="aspect-square bg-gray-200 relative">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="object-cover w-full h-full"
                                />
                                <Badge className="absolute top-2 left-2 bg-black/50 text-white backdrop-blur-sm">
                                    {product.category}
                                </Badge>
                            </div>
                            <div className="p-3 flex-1 flex flex-col">
                                <h3 className="font-medium text-sm line-clamp-2 leading-tight mb-1">
                                    {product.name}
                                </h3>
                                <p className="text-xs text-gray-500 mb-2">
                                    Penjual: {product.sellerName}
                                </p>
                                <div className="mt-auto flex justify-between items-center">
                                    <span className="font-bold text-green-600">
                                        Rp{" "}
                                        {product.price.toLocaleString("id-ID")}
                                    </span>
                                    <Button
                                        size="icon"
                                        className="h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700 shadow-blue-200 shadow-lg"
                                        onClick={() => {
                                            setSelectedProduct(product);
                                            setIsCheckoutOpen(true);
                                        }}
                                    >
                                        <ShoppingCart className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            {/* Checkout Modal */}
            <ShadDialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                <ShadContent className="max-w-sm rounded-xl">
                    <ShadHeader>
                        <ShadTitle>Beli Barang</ShadTitle>
                    </ShadHeader>

                    {selectedProduct && (
                        <div className="space-y-4 py-2">
                            <div className="flex gap-3 bg-gray-50 p-3 rounded-lg border">
                                <img
                                    src={selectedProduct.image}
                                    className="w-14 h-14 object-cover rounded-md"
                                />
                                <div>
                                    <p className="font-medium text-sm">
                                        {selectedProduct.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {selectedProduct.sellerName}
                                    </p>
                                    <p className="text-sm font-bold text-green-600 mt-1">
                                        Rp{" "}
                                        {selectedProduct.price.toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center bg-white p-2 rounded-lg border">
                                <span className="text-sm font-medium">
                                    Jumlah
                                </span>
                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                        onClick={() =>
                                            setQuantity(
                                                Math.max(1, quantity - 1)
                                            )
                                        }
                                    >
                                        -
                                    </Button>
                                    <span className="text-sm font-bold w-4 text-center">
                                        {quantity}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                        onClick={() =>
                                            setQuantity(quantity + 1)
                                        }
                                    >
                                        +
                                    </Button>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-1 block">
                                    Pembayaran
                                </label>
                                <ShadSelect onValueChange={setPaymentMethod}>
                                    <ShadSelectTrigger>
                                        <ShadSelectValue placeholder="Pilih Metode" />
                                    </ShadSelectTrigger>
                                    <ShadSelectContent>
                                        <ShadSelectItem value="DANA">
                                            DANA (Transfer)
                                        </ShadSelectItem>
                                        <ShadSelectItem value="GOPAY">
                                            GoPay (Transfer)
                                        </ShadSelectItem>
                                        <ShadSelectItem value="COD">
                                            Bayar di Tempat (COD)
                                        </ShadSelectItem>
                                    </ShadSelectContent>
                                </ShadSelect>
                            </div>

                            <div className="border-t pt-3 flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span className="text-blue-600">
                                    Rp{" "}
                                    {(
                                        selectedProduct.price * quantity
                                    ).toLocaleString()}
                                </span>
                            </div>

                            <Button
                                className="w-full bg-blue-600"
                                onClick={handleCheckout}
                            >
                                Beli Sekarang
                            </Button>
                        </div>
                    )}
                </ShadContent>
            </ShadDialog>
        </div>
    );
}
