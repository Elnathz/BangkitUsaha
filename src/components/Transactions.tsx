import { useState, useEffect } from "react";
import {
    Plus,
    ArrowDownRight,
    ArrowUpRight,
    Calendar,
    Download,
} from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";

// IMPORT FIREBASE
import { db } from "../lib/firebase";
import {
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    Timestamp,
} from "firebase/firestore";

type TransactionType = "income" | "expense";

interface Transaction {
    id: string;
    type: TransactionType;
    category: string;
    amount: number;
    description: string;
    date: string;
}

export function Transactions() {
    const [filter, setFilter] = useState<"all" | "income" | "expense">("all");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    const [newTransaction, setNewTransaction] = useState({
        type: "income" as TransactionType,
        category: "",
        amount: "",
        description: "",
    });

    // 1. READ DATA (Real-time dari Firebase)
    useEffect(() => {
        // Query: Ambil koleksi 'transactions', urutkan dari yang terbaru
        const q = query(
            collection(db, "transactions"),
            orderBy("createdAt", "desc")
        );

        // Listener: Akan jalan otomatis setiap ada data baru di server
        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Transaction[];

                setTransactions(data);
                setLoading(false);

                // PENTING: Kita update juga LocalStorage agar Dashboard tetap sinkron
                localStorage.setItem(
                    "bangkit-transactions",
                    JSON.stringify(data)
                );
            },
            (error) => {
                console.error("Error fetching transactions:", error);
                toast.error("Gagal mengambil data. Menggunakan mode offline.");

                // Fallback: Jika gagal connect firebase, coba load dari localstorage
                const localData = localStorage.getItem("bangkit-transactions");
                if (localData) {
                    setTransactions(JSON.parse(localData));
                }
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    const filteredTransactions = transactions.filter((t) => {
        if (filter === "all") return true;
        return t.type === filter;
    });

    const totalIncome = transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;

    // 2. CREATE DATA (Simpan ke Firebase)
    const handleAddTransaction = async () => {
        if (!newTransaction.category || !newTransaction.amount) {
            toast.error("Mohon isi kategori dan jumlah uang");
            return;
        }

        // Tampilkan loading toast
        const toastId = toast.loading("Menyimpan transaksi...");

        try {
            const amountValue = parseFloat(newTransaction.amount);
            const dateString = new Date().toISOString().split("T")[0];

            // Kirim ke Firestore
            await addDoc(collection(db, "transactions"), {
                type: newTransaction.type,
                category: newTransaction.category,
                amount: amountValue,
                description: newTransaction.description,
                date: dateString,
                createdAt: Timestamp.now(), // Field khusus untuk sorting
            });

            setIsAddDialogOpen(false);
            setNewTransaction({
                type: "income",
                category: "",
                amount: "",
                description: "",
            });

            toast.dismiss(toastId);
            toast.success("Transaksi tersimpan ke Cloud! ☁️");
        } catch (error) {
            console.error("Error adding document: ", error);
            toast.dismiss(toastId);
            toast.error("Gagal menyimpan (Cek koneksi internet)");
        }
    };

    const handleExportData = () => {
        toast.info("Fitur Export PDF akan segera tersedia");
    };

    const handleOpenFilter = () => {
        toast.info("Filter tanggal akan segera tersedia");
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 pb-8">
                <h1 className="mb-6 font-bold text-xl">Pencatatan Keuangan</h1>

                {/* Balance Summary */}
                <Card className="bg-white/10 backdrop-blur-sm border-0 text-white p-4 mb-4">
                    <p className="text-sm text-green-100 mb-1">
                        Saldo Saat Ini (Cloud)
                    </p>
                    <h2 className="mb-4 text-3xl font-bold">
                        Rp {balance.toLocaleString("id-ID")}
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="flex items-center gap-2 text-sm text-green-100 mb-1">
                                <ArrowUpRight className="w-4 h-4" />
                                <span>Pemasukan</span>
                            </div>
                            <p className="font-semibold">
                                Rp {totalIncome.toLocaleString("id-ID")}
                            </p>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-sm text-green-100 mb-1">
                                <ArrowDownRight className="w-4 h-4" />
                                <span>Pengeluaran</span>
                            </div>
                            <p className="font-semibold">
                                Rp {totalExpense.toLocaleString("id-ID")}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="px-4 -mt-4 pb-24">
                {" "}
                {/* pb-24 agar tidak tertutup navbar bawah */}
                {/* Action Buttons */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    <Dialog
                        open={isAddDialogOpen}
                        onOpenChange={setIsAddDialogOpen}
                    >
                        <DialogTrigger asChild>
                            <Button className="h-auto py-4 flex flex-col gap-2 bg-green-600 hover:bg-green-700 border-none text-white shadow-lg">
                                <Plus className="w-5 h-5" />
                                <span className="text-xs">Catat Baru</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-sm rounded-lg">
                            <DialogHeader>
                                <DialogTitle>Catat Transaksi</DialogTitle>
                                <DialogDescription>
                                    Data akan disimpan ke server Bangkit Usaha.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div>
                                    <Label>Jenis Transaksi</Label>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        <Button
                                            type="button"
                                            variant={
                                                newTransaction.type === "income"
                                                    ? "default"
                                                    : "outline"
                                            }
                                            onClick={() =>
                                                setNewTransaction({
                                                    ...newTransaction,
                                                    type: "income",
                                                })
                                            }
                                            className={`w-full ${
                                                newTransaction.type === "income"
                                                    ? "bg-green-600 hover:bg-green-700"
                                                    : ""
                                            }`}
                                        >
                                            <ArrowUpRight className="w-4 h-4 mr-2" />
                                            Pemasukan
                                        </Button>
                                        <Button
                                            type="button"
                                            variant={
                                                newTransaction.type ===
                                                "expense"
                                                    ? "default"
                                                    : "outline"
                                            }
                                            onClick={() =>
                                                setNewTransaction({
                                                    ...newTransaction,
                                                    type: "expense",
                                                })
                                            }
                                            className={`w-full ${
                                                newTransaction.type ===
                                                "expense"
                                                    ? "bg-red-600 hover:bg-red-700"
                                                    : ""
                                            }`}
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
                                        onChange={(e) =>
                                            setNewTransaction({
                                                ...newTransaction,
                                                category: e.target.value,
                                            })
                                        }
                                        placeholder="Contoh: Jual Beras / Beli Pupuk"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="amount">Jumlah (Rp)</Label>
                                    <Input
                                        id="amount"
                                        type="number"
                                        value={newTransaction.amount}
                                        onChange={(e) =>
                                            setNewTransaction({
                                                ...newTransaction,
                                                amount: e.target.value,
                                            })
                                        }
                                        placeholder="0"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="description">
                                        Keterangan (Opsional)
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={newTransaction.description}
                                        onChange={(e) =>
                                            setNewTransaction({
                                                ...newTransaction,
                                                description: e.target.value,
                                            })
                                        }
                                        placeholder="Catatan tambahan..."
                                        rows={3}
                                    />
                                </div>

                                <Button
                                    onClick={handleAddTransaction}
                                    className="w-full bg-blue-600 hover:bg-blue-700"
                                >
                                    Simpan Transaksi
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Button
                        variant="outline"
                        className="h-auto py-4 flex flex-col gap-2 bg-white text-gray-700"
                        onClick={handleExportData}
                    >
                        <Download className="w-5 h-5" />
                        <span className="text-xs">Export PDF</span>
                    </Button>

                    <Button
                        variant="outline"
                        className="h-auto py-4 flex flex-col gap-2 bg-white text-gray-700"
                        onClick={handleOpenFilter}
                    >
                        <Calendar className="w-5 h-5" />
                        <span className="text-xs">Filter</span>
                    </Button>
                </div>
                {/* Filter Tabs */}
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                    <Button
                        variant={filter === "all" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilter("all")}
                        className={
                            filter === "all" ? "bg-blue-600 text-white" : ""
                        }
                    >
                        Semua
                    </Button>
                    <Button
                        variant={filter === "income" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilter("income")}
                        className={
                            filter === "income" ? "bg-green-600 text-white" : ""
                        }
                    >
                        Pemasukan
                    </Button>
                    <Button
                        variant={filter === "expense" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilter("expense")}
                        className={
                            filter === "expense" ? "bg-red-600 text-white" : ""
                        }
                    >
                        Pengeluaran
                    </Button>
                </div>
                {/* Transactions List */}
                <div className="space-y-3">
                    {loading ? (
                        <div className="text-center py-10">
                            <p className="text-gray-500 animate-pulse">
                                Sedang memuat data dari cloud...
                            </p>
                        </div>
                    ) : filteredTransactions.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">
                                Belum ada data transaksi.
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                Mulai catat keuangan Anda sekarang.
                            </p>
                        </div>
                    ) : (
                        filteredTransactions.map((transaction) => (
                            <Card
                                key={transaction.id}
                                className="p-4 border-l-4 shadow-sm"
                                style={{
                                    borderLeftColor:
                                        transaction.type === "income"
                                            ? "#16a34a"
                                            : "#dc2626",
                                }}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex items-start gap-3">
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {transaction.category}
                                            </p>
                                            <p className="text-sm text-gray-500 line-clamp-1">
                                                {transaction.description}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {new Date(
                                                    transaction.date
                                                ).toLocaleDateString("id-ID", {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <p
                                        className={`font-bold whitespace-nowrap ${
                                            transaction.type === "income"
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {transaction.type === "income"
                                            ? "+"
                                            : "-"}{" "}
                                        Rp{" "}
                                        {transaction.amount.toLocaleString(
                                            "id-ID"
                                        )}
                                    </p>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
