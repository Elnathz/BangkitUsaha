import { useState, useEffect, useRef } from "react";
import {
    ArrowLeft,
    Send,
    Search,
    Phone,
    Video,
    MoreVertical,
} from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card"; // Tambah ini untuk bubble struk
import { toast } from "sonner";

// Firebase Config
import { db } from "../lib/firebase";
import {
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    where,
    Timestamp,
} from "firebase/firestore";

interface ChatProps {
    onClose: () => void;
}

// Simulasi ID User (Harus sama dengan di Products.tsx)
const currentUserId = "user-petani-001";

export function Chat({ onClose }: ChatProps) {
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [chatRooms, setChatRooms] = useState<any[]>([]);
    const [messages, setMessages] = useState<any[]>([]);
    const [messageInput, setMessageInput] = useState("");
    const [loading, setLoading] = useState(true);

    const scrollRef = useRef<HTMLDivElement>(null);

    // 1. FETCH CHAT LIST (Real-time)
    useEffect(() => {
        // Cari chat di mana 'participants' mengandung ID kita
        const q = query(
            collection(db, "chats"),
            where("participants", "array-contains", currentUserId)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const rooms = snapshot.docs.map((doc) => {
                const data = doc.data();
                // Cari nama lawan bicara (bukan nama kita)
                const otherIndex =
                    data.participants.indexOf(currentUserId) === 0 ? 1 : 0;
                const otherName = data.participantNames[otherIndex];

                return {
                    id: doc.id,
                    name: otherName,
                    lastMessage: data.lastMessage,
                    // Convert timestamp firebase ke string jam
                    timestamp:
                        data.updatedAt
                            ?.toDate()
                            .toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            }) || "",
                    unread: data.unreadCount || 0,
                    ...data,
                };
            });
            setChatRooms(rooms);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // 2. FETCH MESSAGES saat Room dipilih
    useEffect(() => {
        if (!selectedChatId) return;

        const messagesRef = collection(db, "chats", selectedChatId, "messages");
        const q = query(messagesRef, orderBy("createdAt", "asc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                // Format waktu
                timestamp:
                    doc
                        .data()
                        .createdAt?.toDate()
                        .toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        }) || "Just now",
            }));
            setMessages(msgs);

            // Auto scroll ke bawah
            setTimeout(() => {
                if (scrollRef.current) {
                    scrollRef.current.scrollTop =
                        scrollRef.current.scrollHeight;
                }
            }, 100);
        });

        return () => unsubscribe();
    }, [selectedChatId]);

    // 3. SEND MESSAGE
    const handleSendMessage = async () => {
        if (!messageInput.trim() || !selectedChatId) return;

        try {
            const messagesRef = collection(
                db,
                "chats",
                selectedChatId,
                "messages"
            );
            await addDoc(messagesRef, {
                text: messageInput,
                senderId: currentUserId,
                createdAt: Timestamp.now(),
                isSystemMessage: false,
            });

            setMessageInput("");
        } catch (error) {
            toast.error("Gagal mengirim pesan");
        }
    };

    // --- TAMPILAN LIST CHAT ---
    if (!selectedChatId) {
        return (
            <div className="fixed inset-x-0 top-0 bottom-0 mx-auto max-w-md bg-white flex flex-col z-[60] shadow-2xl">
                <div className="flex-none bg-white border-b px-4 py-3">
                    <div className="flex items-center gap-3 mb-3">
                        <button
                            onClick={onClose}
                            className="p-2 -ml-2 rounded-full hover:bg-slate-100"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <h2 className="text-lg font-bold">Pesan (Live)</h2>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <p className="p-4 text-center text-gray-400">
                            Memuat percakapan...
                        </p>
                    ) : chatRooms.length === 0 ? (
                        <div className="p-8 text-center text-gray-400">
                            <p>Belum ada pesan.</p>
                            <p className="text-xs mt-2">
                                Lakukan Checkout produk untuk memulai chat
                                otomatis dengan penjual.
                            </p>
                        </div>
                    ) : (
                        chatRooms.map((room) => (
                            <div
                                key={room.id}
                                onClick={() => setSelectedChatId(room.id)}
                                className="flex gap-3 p-4 border-b border-slate-50 active:bg-slate-50 cursor-pointer"
                            >
                                <Avatar>
                                    <AvatarFallback className="bg-blue-600 text-white">
                                        {room.name[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-semibold text-sm">
                                            {room.name}
                                        </h3>
                                        <span className="text-xs text-gray-400">
                                            {room.timestamp}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center mt-1">
                                        <p className="text-sm text-gray-500 truncate">
                                            {room.lastMessage}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        );
    }

    // --- TAMPILAN ROOM CHAT ---
    const currentChat = chatRooms.find((r) => r.id === selectedChatId);

    return (
        <div className="fixed inset-x-0 top-0 bottom-0 mx-auto max-w-md bg-white flex flex-col z-[60] shadow-2xl">
            {/* Header */}
            <div className="flex-none bg-white border-b px-4 py-3 flex items-center gap-3 shadow-sm z-10">
                <button
                    onClick={() => setSelectedChatId(null)}
                    className="p-2 -ml-2 rounded-full hover:bg-slate-100"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <Avatar className="w-9 h-9">
                    <AvatarFallback className="bg-blue-600 text-white">
                        {currentChat?.name[0]}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <h3 className="font-semibold text-sm">
                        {currentChat?.name}
                    </h3>
                    <p className="text-xs text-gray-500">Online</p>
                </div>
                <Button variant="ghost" size="icon">
                    <MoreVertical className="w-5 h-5 text-gray-500" />
                </Button>
            </div>

            {/* Messages List */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto bg-slate-100 p-4 space-y-4"
            >
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${
                            msg.senderId === currentUserId
                                ? "justify-end"
                                : "justify-start"
                        }`}
                    >
                        {/* Logic Tampilan Pesan: System vs User */}
                        {msg.isSystemMessage ? (
                            // TAMPILAN STRUK PESANAN (Checkout Confirmation)
                            <Card className="max-w-[85%] p-3 bg-white border-l-4 border-green-500 shadow-sm text-sm">
                                <p className="font-bold text-green-700 mb-1">
                                    🧾 TRANSAKSI BARU
                                </p>
                                <div className="whitespace-pre-line text-gray-700">
                                    {msg.text}
                                </div>
                                <div className="mt-2 pt-2 border-t text-xs text-gray-400 text-right">
                                    {msg.timestamp}
                                </div>
                            </Card>
                        ) : (
                            // TAMPILAN CHAT BIASA
                            <div
                                className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                                    msg.senderId === currentUserId
                                        ? "bg-blue-600 text-white rounded-tr-none"
                                        : "bg-white text-gray-800 rounded-tl-none"
                                }`}
                            >
                                <p>{msg.text}</p>
                                <p
                                    className={`text-[10px] mt-1 text-right ${
                                        msg.senderId === currentUserId
                                            ? "text-blue-200"
                                            : "text-gray-400"
                                    }`}
                                >
                                    {msg.timestamp}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Input */}
            <div className="flex-none bg-white border-t p-3 w-full">
                <div className="flex items-end gap-2 bg-slate-50 p-1.5 rounded-3xl border border-slate-200">
                    <Input
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={(e) =>
                            e.key === "Enter" && handleSendMessage()
                        }
                        placeholder="Ketik pesan..."
                        className="flex-1 bg-transparent border-none focus-visible:ring-0 shadow-none min-h-[40px] py-2 px-3"
                    />
                    <Button
                        onClick={handleSendMessage}
                        disabled={!messageInput.trim()}
                        size="icon"
                        className="rounded-full w-10 h-10 bg-blue-600 hover:bg-blue-700 shrink-0 mb-0.5"
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
