import { useState, useEffect } from "react";
import { Plus, Trash2, Package } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { toast } from "sonner";

// Firebase Imports
import { db } from "../lib/firebase";
import {
    collection,
    addDoc,
    onSnapshot,
    query,
    where,
    deleteDoc,
    doc,
    Timestamp,
} from "firebase/firestore";

// User Helper Import
import { getCurrentUser } from "../lib/user";

export function MyStore() {
    // Ambil data user yang sedang login di HP ini
    const currentUser = getCurrentUser();

    const [myProducts, setMyProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddOpen, setIsAddOpen] = useState(false);

    // Form State
    const [newProduct, setNewProduct] = useState({
        name: "",
        price: "",
        stock: "",
        category: "",
        description: "",
    });

    // 1. READ MY PRODUCTS (Hanya ambil barang yang sellerId-nya sama dengan ID saya)
    useEffect(() => {
        if (!currentUser?.id) return;

        const q = query(
            collection(db, "products"),
            where("sellerId", "==", currentUser.id)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setMyProducts(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser.id]);

    // 2. CREATE PRODUCT (Jual Barang ke Database)
    const handleAddProduct = async () => {
        if (!newProduct.name || !newProduct.price) {
            toast.error("Nama dan Harga wajib diisi");
            return;
        }

        try {
            // Data ini akan masuk ke Firestore (Cloud)
            await addDoc(collection(db, "products"), {
                name: newProduct.name,
                price: Number(newProduct.price),
                stock: Number(newProduct.stock),
                category: newProduct.category || "Umum",
                description: newProduct.description,

                // PENTING: Menandai ini barang milik user yang sedang login
                sellerId: currentUser.id,
                sellerName: currentUser.name,

                // Gambar placeholder (nanti bisa diganti fitur upload foto)
                image: "https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=400",
                createdAt: Timestamp.now(),
            });

            setIsAddOpen(false);
            setNewProduct({
                name: "",
                price: "",
                stock: "",
                category: "",
                description: "",
            });
            toast.success("Barang jualan berhasil ditambahkan ke pasar!");
        } catch (error) {
            console.error(error);
            toast.error("Gagal menyimpan data ke internet");
        }
    };

    // 3. DELETE PRODUCT (Hapus dari Database)
    const handleDelete = async (id: string) => {
        if (confirm("Hapus barang ini dari stok toko Anda?")) {
            try {
                await deleteDoc(doc(db, "products", id));
                toast.success("Barang berhasil dihapus");
            } catch (error) {
                toast.error("Gagal menghapus barang");
            }
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-24">
            {/* Header */}
            <div className="bg-white p-4 sticky top-0 z-10 border-b flex justify-between items-center">
                <div>
                    <h1 className="text-lg font-bold">Stok Toko Saya</h1>
                    <p className="text-xs text-gray-500">
                        Halo, {currentUser.name}! Kelola daganganmu.
                    </p>
                </div>

                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            <Plus className="w-4 h-4 mr-1" /> Jual Barang
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Jual Barang Baru</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-3 py-2">
                            <div>
                                <Label>Nama Barang</Label>
                                <Input
                                    value={newProduct.name}
                                    onChange={(e) =>
                                        setNewProduct({
                                            ...newProduct,
                                            name: e.target.value,
                                        })
                                    }
                                    placeholder="Contoh: Beras Merah 1kg"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label>Harga (Rp)</Label>
                                    <Input
                                        type="number"
                                        value={newProduct.price}
                                        onChange={(e) =>
                                            setNewProduct({
                                                ...newProduct,
                                                price: e.target.value,
                                            })
                                        }
                                        placeholder="15000"
                                    />
                                </div>
                                <div>
                                    <Label>Stok Awal</Label>
                                    <Input
                                        type="number"
                                        value={newProduct.stock}
                                        onChange={(e) =>
                                            setNewProduct({
                                                ...newProduct,
                                                stock: e.target.value,
                                            })
                                        }
                                        placeholder="10"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label>Kategori</Label>
                                <Input
                                    value={newProduct.category}
                                    onChange={(e) =>
                                        setNewProduct({
                                            ...newProduct,
                                            category: e.target.value,
                                        })
                                    }
                                    placeholder="Pertanian / Kerajinan"
                                />
                            </div>
                            <Button
                                onClick={handleAddProduct}
                                className="w-full mt-2 bg-blue-600 hover:bg-blue-700"
                            >
                                Tayangkan di Pasar
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* List Barang Saya */}
            <div className="p-4 space-y-3">
                {loading ? (
                    <p className="text-center text-gray-400">
                        Memuat stok dari server...
                    </p>
                ) : myProducts.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">
                        <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Toko Anda masih kosong.</p>
                        <p className="text-xs mt-1">
                            Klik tombol "Jual Barang" di atas.
                        </p>
                    </div>
                ) : (
                    myProducts.map((item) => (
                        <Card
                            key={item.id}
                            className="p-3 flex gap-3 items-center"
                        >
                            <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden shrink-0">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm truncate">
                                    {item.name}
                                </h3>
                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                    <span className="bg-gray-100 px-1.5 py-0.5 rounded">
                                        Stok: {item.stock}
                                    </span>
                                    <span className="truncate max-w-[100px]">
                                        {item.category}
                                    </span>
                                </div>
                                <p className="text-green-600 font-bold text-sm mt-1">
                                    Rp {item.price.toLocaleString()}
                                </p>
                            </div>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="text-red-500 hover:bg-red-50"
                                onClick={() => handleDelete(item.id)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
