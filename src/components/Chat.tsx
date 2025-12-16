import { useState } from "react";
import {
    ArrowLeft,
    Send,
    Search,
    MoreVertical,
    Phone,
    Video,
} from "lucide-react";
// Pastikan path import ini sesuai dengan struktur folder Anda
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { toast } from "sonner";

interface ChatProps {
    onClose: () => void;
}

interface ChatRoom {
    id: string;
    customer: {
        name: string;
        avatar?: string;
    };
    lastMessage: string;
    timestamp: string;
    unread: number;
    isOnline: boolean;
}

interface Message {
    id: string;
    sender: "me" | "customer";
    text: string;
    timestamp: string;
}

export function Chat({ onClose }: ChatProps) {
    const [selectedChat, setSelectedChat] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [messageInput, setMessageInput] = useState("");

    const chatRooms: ChatRoom[] = [
        {
            id: "1",
            customer: {
                name: "Budi Santoso",
                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
            },
            lastMessage: "Terima kasih, produknya sudah sampai",
            timestamp: "10:30",
            unread: 0,
            isOnline: true,
        },
        {
            id: "2",
            customer: {
                name: "Siti Aminah",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
            },
            lastMessage: "Apakah produk ready stock?",
            timestamp: "09:15",
            unread: 2,
            isOnline: false,
        },
        {
            id: "3",
            customer: { name: "Ahmad Yani" },
            lastMessage: "Oke, saya transfer sekarang",
            timestamp: "Kemarin",
            unread: 0,
            isOnline: false,
        },
    ];

    const messages: { [key: string]: Message[] } = {
        "1": [
            {
                id: "1",
                sender: "customer",
                text: "Halo, saya mau pesan keripik singkong",
                timestamp: "10:00",
            },
            {
                id: "2",
                sender: "me",
                text: "Halo! Siap, mau pesan berapa paket?",
                timestamp: "10:02",
            },
            {
                id: "3",
                sender: "customer",
                text: "3 paket ya",
                timestamp: "10:05",
            },
            {
                id: "4",
                sender: "me",
                text: "Baik, total Rp 75.000. Mau COD atau transfer?",
                timestamp: "10:06",
            },
            {
                id: "5",
                sender: "customer",
                text: "Transfer aja. Ini nomor rekeningnya apa?",
                timestamp: "10:10",
            },
            {
                id: "6",
                sender: "me",
                text: "BCA 1234567890 a/n Ibu Sari",
                timestamp: "10:11",
            },
            {
                id: "7",
                sender: "customer",
                text: "Terima kasih, produknya sudah sampai",
                timestamp: "10:30",
            },
        ],
        "2": [
            {
                id: "1",
                sender: "customer",
                text: "Apakah produk ready stock?",
                timestamp: "09:15",
            },
        ],
        "3": [
            {
                id: "1",
                sender: "customer",
                text: "Oke, saya transfer sekarang",
                timestamp: "Kemarin",
            },
        ],
    };

    const filteredChatRooms = chatRooms.filter((room) =>
        room.customer.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSendMessage = () => {
        if (!messageInput.trim() || !selectedChat) return;

        // In a real app, this would send the message
        setMessageInput("");
        toast.success("Pesan terkirim");
    };

    const handleCall = () => {
        toast.info("Fitur panggilan telepon akan segera tersedia");
    };

    const handleVideoCall = () => {
        toast.info("Fitur video call akan segera tersedia");
    };

    const handleMoreOptions = () => {
        toast.info("Menampilkan opsi lainnya...");
    };

    // TAMPILAN 1: LIST CHAT (Belum memilih chat)
    if (!selectedChat) {
        return (
            <div className="bg-white min-h-screen">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b p-4 z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <button onClick={onClose}>
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <h2 className="flex-1 font-semibold text-lg">Chat</h2>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Cari chat..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Chat List */}
                <div className="divide-y">
                    {filteredChatRooms.map((room) => (
                        <button
                            key={room.id}
                            onClick={() => setSelectedChat(room.id)}
                            className="w-full p-4 hover:bg-gray-50 transition-colors text-left"
                        >
                            <div className="flex gap-3">
                                <div className="relative">
                                    <Avatar>
                                        <AvatarImage
                                            src={room.customer.avatar}
                                        />
                                        <AvatarFallback className="bg-blue-600 text-white">
                                            {room.customer.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    {room.isOnline && (
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <p className="truncate font-medium">
                                            {room.customer.name}
                                        </p>
                                        <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                                            {room.timestamp}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm text-gray-600 truncate">
                                            {room.lastMessage}
                                        </p>
                                        {room.unread > 0 && (
                                            <Badge className="bg-blue-600 ml-2 flex-shrink-0">
                                                {room.unread}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                {filteredChatRooms.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">
                            Tidak ada chat ditemukan
                        </p>
                    </div>
                )}
            </div>
        );
    }

    // TAMPILAN 2: ROOM CHAT (Sudah memilih chat)
    const currentChat = chatRooms.find((room) => room.id === selectedChat);
    const currentMessages = messages[selectedChat] || [];

    return (
        // PERUBAHAN UTAMA DI SINI:
        // h-screen: Memaksa tinggi container pas 1 layar
        // flex flex-col: Mengatur anak elemen secara vertikal
        // overflow-hidden: Mencegah scroll pada body utama
        <div className="bg-white h-screen flex flex-col overflow-hidden">
            {/* 1. Header (Fixed, tidak ikut scroll) */}
            <div className="flex-none bg-white border-b p-4 z-10 shadow-sm">
                <div className="flex items-center gap-3">
                    <button onClick={() => setSelectedChat(null)}>
                        <ArrowLeft className="w-6 h-6" />
                    </button>

                    <div className="relative">
                        <Avatar className="w-10 h-10">
                            <AvatarImage src={currentChat?.customer.avatar} />
                            <AvatarFallback className="bg-blue-600 text-white">
                                {currentChat?.customer.name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        {currentChat?.isOnline && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                    </div>

                    <div className="flex-1">
                        <p className="font-semibold">
                            {currentChat?.customer.name}
                        </p>
                        <p className="text-xs text-gray-500">
                            {currentChat?.isOnline ? "Online" : "Offline"}
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 w-9 p-0"
                            onClick={handleCall}
                        >
                            <Phone className="w-5 h-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 w-9 p-0"
                            onClick={handleVideoCall}
                        >
                            <Video className="w-5 h-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 w-9 p-0"
                            onClick={handleMoreOptions}
                        >
                            <MoreVertical className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* 2. Messages (Flexible, Scrollable) */}
            {/* flex-1: Mengambil sisa ruang yang tersedia */}
            {/* overflow-y-auto: Scrollbar hanya muncul di area ini */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {currentMessages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${
                            message.sender === "me"
                                ? "justify-end"
                                : "justify-start"
                        }`}
                    >
                        <div
                            className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                                message.sender === "me"
                                    ? "bg-blue-600 text-white rounded-tr-none"
                                    : "bg-white text-gray-900 rounded-tl-none border border-gray-200"
                            }`}
                        >
                            <p className="text-sm">{message.text}</p>
                            <p
                                className={`text-[10px] mt-1 text-right ${
                                    message.sender === "me"
                                        ? "text-blue-100"
                                        : "text-gray-400"
                                }`}
                            >
                                {message.timestamp}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* 3. Message Input (Fixed di bawah) */}
            {/* flex-none: Ukurannya tetap, tidak menyusut */}
            <div className="flex-none border-t p-4 bg-white">
                <div className="flex gap-2">
                    <Input
                        type="text"
                        placeholder="Ketik pesan..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={(e) =>
                            e.key === "Enter" && handleSendMessage()
                        }
                        className="flex-1"
                    />
                    <Button
                        onClick={handleSendMessage}
                        className="px-6 bg-blue-600 hover:bg-blue-700"
                    >
                        <Send className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
