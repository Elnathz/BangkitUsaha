// FILE: src/components/inventory/Products.tsx
// LENGKAP dengan Auto-create Chat Room saat Checkout

import { useState, useEffect } from "react";
import { Search, ShoppingCart, User } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

// Firebase
import { db, auth } from "../../lib/firebase";
import {
    collection,
    addDoc,
    onSnapshot,
    query,
    Timestamp,
    doc,
    setDoc,
    getDoc,
    updateDoc,
} from "firebase/firestore";

export function Products() {
    const [products, setProducts] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    // Checkout State
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [quantity, setQuantity] = useState(1);

    const currentUser = auth.currentUser;

    // 1. READ MARKETPLACE (Tampilkan barang orang lain)
    useEffect(() => {
        const q = query(collection(db, "products"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs
                .map((doc) => ({ id: doc.id, ...doc.data() }))
                // Filter di sisi klien: Jangan tampilkan barang saya sendiri
                .filter((item: any) =>
                    currentUser ? item.sellerId !== currentUser.uid : true
                );

            setProducts(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [currentUser]);

    // 2. CHECKOUT -> CREATE ORDER + AUTO CREATE CHAT ROOM
    const handleCheckout = async () => {
        if (!currentUser) {
            toast.error("Login dulu untuk membeli");
            return;
        }
        if (!paymentMethod) {
            toast.error("Pilih metode pembayaran");
            return;
        }

        const total = selectedProduct.price * quantity;
        const toastId = toast.loading("Memproses pesanan...");

        try {
            // ========================================
            // STEP 1: SIMPAN ORDER KE DATABASE
            // ========================================
            await addDoc(collection(db, "orders"), {
                // Info Produk
                productId: selectedProduct.id,
                productName: selectedProduct.name,
                price: selectedProduct.price,
                quantity: quantity,
                total: total,
                image: selectedProduct.image,

                // Info Pembeli (Saya)
                buyerId: currentUser.uid,
                buyerName: currentUser.displayName || currentUser.email,

                // Info Penjual (Pemilik Barang)
                sellerId: selectedProduct.sellerId,
                sellerName: selectedProduct.sellerName,

                status: "pending",
                paymentMethod: paymentMethod,
                createdAt: Timestamp.now(),
            });

            // ========================================
            // STEP 2: CREATE/UPDATE CHAT ROOM
            // ========================================
            // Chat ID dibuat dari kombinasi 2 user ID (sorted untuk konsistensi)
            const chatId = [currentUser.uid, selectedProduct.sellerId]
                .sort()
                .join("_");
            const chatRef = doc(db, "chats", chatId);

            // Check apakah chat room sudah ada
            const chatSnap = await getDoc(chatRef);

            if (!chatSnap.exists()) {
                // Buat chat room baru
                await setDoc(chatRef, {
                    participants: [currentUser.uid, selectedProduct.sellerId],
                    participantNames: [
                        currentUser.displayName ||
                            currentUser.email ||
                            "Pembeli",
                        selectedProduct.sellerName,
                    ],
                    lastMessage: `Pesanan ${selectedProduct.name}`,
                    updatedAt: Timestamp.now(),
                    unreadCount: {
                        [currentUser.uid]: 0, // Pembeli tidak ada unread
                        [selectedProduct.sellerId]: 1, // Penjual ada 1 unread (struk)
                    },
                    onlineStatus: {
                        [currentUser.uid]: true,
                        [selectedProduct.sellerId]: false,
                    },
                });
            } else {
                // Update chat room yang sudah ada
                const existingUnread =
                    chatSnap.data().unreadCount?.[selectedProduct.sellerId] ||
                    0;
                await updateDoc(chatRef, {
                    lastMessage: `Pesanan ${selectedProduct.name}`,
                    updatedAt: Timestamp.now(),
                    [`unreadCount.${selectedProduct.sellerId}`]:
                        existingUnread + 1,
                });
            }

            // ========================================
            // STEP 3: KIRIM SYSTEM MESSAGE (STRUK)
            // ========================================
            const strukMessage = `PESANAN BARU
─────────────────────
Produk: ${selectedProduct.name}
Jumlah: ${quantity} x Rp ${selectedProduct.price.toLocaleString()}
Pembayaran: ${paymentMethod}

TOTAL: Rp ${total.toLocaleString()}
─────────────────────
Terima kasih sudah berbelanja!`;

            await addDoc(collection(db, "chats", chatId, "messages"), {
                text: strukMessage,
                senderId: "system",
                createdAt: Timestamp.now(),
                isSystemMessage: true,
                read: false,
            });

            // ========================================
            // STEP 4: RESET FORM & NOTIFY USER
            // ========================================
            setIsCheckoutOpen(false);
            setQuantity(1);
            setPaymentMethod("");
            toast.dismiss(toastId);
            toast.success(
                "✅ Pesanan berhasil! Cek tab Pesan untuk chat dengan penjual."
            );
        } catch (error) {
            console.error("Error during checkout:", error);
            toast.dismiss(toastId);
            toast.error("❌ Gagal memproses pesanan. Coba lagi.");
        }
    };

    // Filter produk berdasarkan search query
    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // ========================================
    // RENDER UI
    // ========================================
    return (
        <div className="bg-gray-50 min-h-screen pb-24">
            {/* ===== HEADER ===== */}
            <div className="bg-white p-4 sticky top-0 z-10 border-b shadow-sm">
                <h1 className="text-xl font-bold mb-3">Pasar Warga</h1>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Cari kebutuhan..."
                        className="pl-9 bg-gray-100 border-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* ===== PRODUCT GRID ===== */}
            <div className="p-4 grid grid-cols-2 gap-3">
                {loading ? (
                    <p className="col-span-2 text-center text-gray-400 mt-10">
                        Memuat pasar...
                    </p>
                ) : filteredProducts.length === 0 ? (
                    <div className="col-span-2 text-center py-10">
                        <p className="text-gray-500">
                            Tidak ada produk ditemukan.
                        </p>
                    </div>
                ) : (
                    filteredProducts.map((product) => (
                        <Card
                            key={product.id}
                            className="overflow-hidden flex flex-col"
                        >
                            {/* Product Image */}
                            <div className="aspect-square relative bg-gray-200">
                                <ImageWithFallback
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Product Info */}
                            <div className="p-3 flex-1 flex flex-col">
                                <h3 className="font-medium text-sm line-clamp-2 mb-1">
                                    {product.name}
                                </h3>
                                <p className="text-green-600 font-bold text-sm mb-2">
                                    Rp {product.price.toLocaleString()}
                                </p>
                                <div className="flex items-center gap-1 text-[10px] text-gray-500 mb-3">
                                    <User className="w-3 h-3" />
                                    <span className="truncate">
                                        {product.sellerName}
                                    </span>
                                </div>

                                {/* Buy Button */}
                                <Button
                                    size="sm"
                                    className="mt-auto w-full bg-blue-600 text-xs h-8"
                                    onClick={() => {
                                        setSelectedProduct(product);
                                        setIsCheckoutOpen(true);
                                    }}
                                >
                                    Beli
                                </Button>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            {/* ===== CHECKOUT DIALOG ===== */}
            <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                <DialogContent className="max-w-sm rounded-lg">
                    <DialogHeader>
                        <DialogTitle>Konfirmasi Pembelian</DialogTitle>
                    </DialogHeader>
                    {selectedProduct && (
                        <div className="space-y-4 py-2">
                            {/* Product Preview */}
                            <div className="flex gap-3 bg-gray-50 p-2 rounded">
                                <img
                                    src={selectedProduct.image}
                                    className="w-16 h-16 object-cover rounded"
                                    alt={selectedProduct.name}
                                />
                                <div>
                                    <p className="font-bold text-sm">
                                        {selectedProduct.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Penjual: {selectedProduct.sellerName}
                                    </p>
                                    <p className="text-green-600 text-sm">
                                        Rp{" "}
                                        {selectedProduct.price.toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            {/* Quantity Selector */}
                            <div className="flex items-center justify-between border p-2 rounded">
                                <span className="text-sm">Jumlah</span>
                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-6 w-6"
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
                                        size="icon"
                                        className="h-6 w-6"
                                        onClick={() =>
                                            setQuantity(quantity + 1)
                                        }
                                    >
                                        +
                                    </Button>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Metode Pembayaran
                                </label>
                                <Select onValueChange={setPaymentMethod}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="COD">
                                            Bayar di Tempat (COD)
                                        </SelectItem>
                                        <SelectItem value="TRANSFER">
                                            Transfer Bank
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Total */}
                            <div className="flex justify-between items-center pt-2 border-t font-bold">
                                <span>Total</span>
                                <span className="text-blue-600">
                                    Rp{" "}
                                    {(
                                        selectedProduct.price * quantity
                                    ).toLocaleString()}
                                </span>
                            </div>

                            {/* Checkout Button */}
                            <Button
                                className="w-full bg-blue-600"
                                onClick={handleCheckout}
                            >
                                <ShoppingCart className="w-4 h-4 mr-2" /> Pesan
                                Sekarang
                            </Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
