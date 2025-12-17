// FILE: src/components/Chat.tsx
// LENGKAP - Real-time Chat dengan Firestore

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Send, MoreVertical, Check, CheckCheck } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Card } from "./ui/card";
import { toast } from "sonner";

// Firebase
import { db, auth } from "../lib/firebase";
import {
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    where,
    Timestamp,
    doc,
    updateDoc,
} from "firebase/firestore";

interface ChatProps {
    onClose: () => void;
}

export function Chat({ onClose }: ChatProps) {
    // ========================================
    // STATE MANAGEMENT
    // ========================================
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [chatRooms, setChatRooms] = useState<any[]>([]);
    const [messages, setMessages] = useState<any[]>([]);
    const [messageInput, setMessageInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    const scrollRef = useRef<HTMLDivElement>(null);
    const currentUser = auth.currentUser;

    // ========================================
    // AUTO SCROLL KE BAWAH SAAT ADA PESAN BARU
    // ========================================
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // ========================================
    // 1. FETCH CHAT ROOMS (Real-time)
    // ========================================
    useEffect(() => {
        if (!currentUser) return;

        const q = query(
            collection(db, "chats"),
            where("participants", "array-contains", currentUser.uid)
        );

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const rooms = snapshot.docs.map((doc) => {
                    const data = doc.data();

                    // Cari ID lawan bicara (bukan ID saya)
                    const otherUserId = data.participants.find(
                        (id: string) => id !== currentUser.uid
                    );

                    // Cari nama lawan bicara
                    const otherUserIndex =
                        data.participants.indexOf(otherUserId);
                    const otherUserName =
                        data.participantNames[otherUserIndex] || "Unknown User";

                    return {
                        id: doc.id,
                        name: otherUserName,
                        otherUserId: otherUserId,
                        lastMessage: data.lastMessage || "Belum ada pesan",
                        timestamp:
                            data.updatedAt
                                ?.toDate()
                                .toLocaleTimeString("id-ID", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                }) || "",
                        unread: data.unreadCount?.[currentUser.uid] || 0,
                        isOnline: data.onlineStatus?.[otherUserId] || false,
                        updatedAt: data.updatedAt,
                        ...data,
                    };
                });

                // Sort by last update (newest first)
                rooms.sort((a, b) => {
                    const aTime = a.updatedAt?.toMillis() || 0;
                    const bTime = b.updatedAt?.toMillis() || 0;
                    return bTime - aTime;
                });

                setChatRooms(rooms);
                setLoading(false);
            },
            (error) => {
                console.error("Error fetching chat rooms:", error);
                toast.error("Gagal memuat percakapan");
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [currentUser]);

    // ========================================
    // 2. FETCH MESSAGES SAAT ROOM DIPILIH
    // ========================================
    useEffect(() => {
        if (!selectedChatId) return;

        const messagesRef = collection(db, "chats", selectedChatId, "messages");
        const q = query(messagesRef, orderBy("createdAt", "asc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                timestamp:
                    doc.data().createdAt?.toDate().toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                    }) || "Mengirim...",
            }));
            setMessages(msgs);

            // Mark messages as read
            if (currentUser) {
                markMessagesAsRead(selectedChatId, currentUser.uid);
            }
        });

        return () => unsubscribe();
    }, [selectedChatId, currentUser]);

    // ========================================
    // 3. MARK MESSAGES AS READ
    // ========================================
    const markMessagesAsRead = async (chatId: string, userId: string) => {
        try {
            const chatRef = doc(db, "chats", chatId);
            await updateDoc(chatRef, {
                [`unreadCount.${userId}`]: 0,
            });
        } catch (error) {
            console.error("Error marking as read:", error);
        }
    };

    // ========================================
    // 4. SEND MESSAGE
    // ========================================
    const handleSendMessage = async () => {
        if (!messageInput.trim() || !selectedChatId || !currentUser) return;

        setSending(true);
        try {
            const messagesRef = collection(
                db,
                "chats",
                selectedChatId,
                "messages"
            );

            // Add message to subcollection
            await addDoc(messagesRef, {
                text: messageInput,
                senderId: currentUser.uid,
                createdAt: Timestamp.now(),
                isSystemMessage: false,
                read: false,
            });

            // Update chat room metadata
            const chatRef = doc(db, "chats", selectedChatId);
            const currentChat = chatRooms.find((r) => r.id === selectedChatId);
            const otherUserId = currentChat?.otherUserId;

            if (otherUserId) {
                await updateDoc(chatRef, {
                    lastMessage: messageInput,
                    updatedAt: Timestamp.now(),
                    [`unreadCount.${otherUserId}`]:
                        (currentChat?.unreadCount?.[otherUserId] || 0) + 1,
                });
            }

            setMessageInput("");
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Gagal mengirim pesan");
        } finally {
            setSending(false);
        }
    };

    // ========================================
    // 5. HANDLE ENTER KEY
    // ========================================
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // ========================================
    // RENDER: TAMPILAN LIST CHAT
    // ========================================
    if (!selectedChatId) {
        return (
            <div className="fixed inset-0 bg-white flex flex-col z-[60] max-w-md mx-auto">
                {/* Header */}
                <div className="flex-none bg-white border-b px-4 py-3">
                    <div className="flex items-center gap-3 mb-3">
                        <button
                            onClick={onClose}
                            className="p-2 -ml-2 rounded-full hover:bg-gray-100"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <h2 className="text-lg font-bold">Pesan</h2>
                    </div>
                </div>

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="p-4 text-center text-gray-400">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-2">Memuat percakapan...</p>
                        </div>
                    ) : chatRooms.length === 0 ? (
                        <div className="p-8 text-center text-gray-400">
                            <p>Belum ada pesan.</p>
                            <p className="text-xs mt-2">
                                Mulai berbelanja untuk chat dengan penjual.
                            </p>
                        </div>
                    ) : (
                        chatRooms.map((room) => (
                            <div
                                key={room.id}
                                onClick={() => setSelectedChatId(room.id)}
                                className="flex gap-3 p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                                {/* Avatar with Online Status */}
                                <div className="relative">
                                    <Avatar>
                                        <AvatarFallback className="bg-blue-600 text-white">
                                            {room.name[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    {room.isOnline && (
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                    )}
                                </div>

                                {/* Chat Info */}
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
                                        {room.unread > 0 && (
                                            <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5 ml-2">
                                                {room.unread}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        );
    }

    // ========================================
    // RENDER: TAMPILAN ROOM CHAT
    // ========================================
    const currentChat = chatRooms.find((r) => r.id === selectedChatId);

    return (
        <div className="fixed inset-0 bg-white flex flex-col z-[60] max-w-md mx-auto">
            {/* Header */}
            <div className="flex-none bg-white border-b px-4 py-3 flex items-center gap-3 shadow-sm">
                <button
                    onClick={() => setSelectedChatId(null)}
                    className="p-2 -ml-2 rounded-full hover:bg-gray-100"
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
                    <p className="text-xs text-gray-500">
                        {currentChat?.isOnline ? "Online" : "Offline"}
                    </p>
                </div>
                <Button variant="ghost" size="icon">
                    <MoreVertical className="w-5 h-5 text-gray-500" />
                </Button>
            </div>

            {/* Messages List */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-4"
            >
                {messages.length === 0 ? (
                    <div className="text-center text-gray-400 mt-8">
                        <p>Belum ada pesan</p>
                        <p className="text-xs mt-1">
                            Mulai percakapan dengan mengirim pesan
                        </p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${
                                msg.senderId === currentUser?.uid
                                    ? "justify-end"
                                    : "justify-start"
                            }`}
                        >
                            {msg.isSystemMessage ? (
                                // System Message (Struk Pesanan)
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
                                // Regular Message
                                <div
                                    className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                                        msg.senderId === currentUser?.uid
                                            ? "bg-blue-600 text-white rounded-tr-none"
                                            : "bg-white text-gray-800 rounded-tl-none"
                                    }`}
                                >
                                    <p className="break-words">{msg.text}</p>
                                    <div
                                        className={`flex items-center gap-1 justify-end mt-1 text-[10px] ${
                                            msg.senderId === currentUser?.uid
                                                ? "text-blue-200"
                                                : "text-gray-400"
                                        }`}
                                    >
                                        <span>{msg.timestamp}</span>
                                        {msg.senderId === currentUser?.uid && (
                                            <>
                                                {msg.read ? (
                                                    <CheckCheck className="w-3 h-3" />
                                                ) : (
                                                    <Check className="w-3 h-3" />
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Input Area */}
            <div className="flex-none bg-white border-t p-3">
                <div className="flex items-end gap-2 bg-gray-50 p-2 rounded-3xl border border-gray-200">
                    <Input
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ketik pesan..."
                        disabled={sending}
                        className="flex-1 bg-transparent border-none focus-visible:ring-0 shadow-none min-h-[40px] py-2 px-3"
                    />
                    <Button
                        onClick={handleSendMessage}
                        disabled={!messageInput.trim() || sending}
                        size="icon"
                        className="rounded-full w-10 h-10 bg-blue-600 hover:bg-blue-700 shrink-0"
                    >
                        {sending ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
    