import { useState, useEffect } from "react"; // FIXED: Menambahkan useEffect
import { Search, ShoppingCart, User } from "lucide-react"; // FIXED: Menambahkan ShoppingCart
import { Card } from "../ui/card"; // FIXED: Path mundur satu langkah
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"; // FIXED: Path ../ui/dialog
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select"; // FIXED: Path ../ui/select

// Firebase
// FIXED: Path mundur dua langkah (../../) untuk keluar dari inventory -> components -> src
import { db, auth } from "../../lib/firebase";
import {
    collection,
    addDoc,
    onSnapshot,
    query,
    Timestamp,
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

    // 2. CHECKOUT -> CREATE ORDER
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
            // Simpan ke database 'orders'
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

            setIsCheckoutOpen(false);
            setQuantity(1);
            setPaymentMethod("");
            toast.dismiss(toastId);
            toast.success("Pesanan berhasil dibuat! Cek tab Pesanan.");
        } catch (error) {
            console.error(error);
            toast.dismiss(toastId);
            toast.error("Gagal membeli produk");
        }
    };

    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-gray-50 min-h-screen pb-24">
            {/* Header */}
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

            {/* Product Grid */}
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
                            <div className="aspect-square relative bg-gray-200">
                                <ImageWithFallback
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
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

            {/* Checkout Dialog */}
            <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                <DialogContent className="max-w-sm rounded-lg">
                    <DialogHeader>
                        <DialogTitle>Konfirmasi Pembelian</DialogTitle>
                    </DialogHeader>
                    {selectedProduct && (
                        <div className="space-y-4 py-2">
                            <div className="flex gap-3 bg-gray-50 p-2 rounded">
                                <img
                                    src={selectedProduct.image}
                                    className="w-16 h-16 object-cover rounded"
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

                            <div className="flex justify-between items-center pt-2 border-t font-bold">
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
