import { useState, useEffect } from "react";
import { MessageSquare, Heart, Share2, Send, Users } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";

// Firebase
import { db } from "../lib/firebase";
import {
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    Timestamp,
} from "firebase/firestore";

const currentUserName = "Pak Tani (Saya)";

export function Community() {
    const [posts, setPosts] = useState<any[]>([]);
    const [newPost, setNewPost] = useState("");
    const [loading, setLoading] = useState(true);

    // 1. READ POSTS
    useEffect(() => {
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPosts(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // 2. CREATE POST
    const handlePost = async () => {
        if (!newPost.trim()) return;

        try {
            await addDoc(collection(db, "posts"), {
                text: newPost,
                author: currentUserName,
                likes: 0,
                comments: 0,
                createdAt: Timestamp.now(),
                avatar: "https://github.com/shadcn.png", // Placeholder avatar
            });
            setNewPost("");
            toast.success("Status terkirim!");
        } catch (error) {
            toast.error("Gagal mengirim status");
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-24">
            {/* Header */}
            <div className="bg-white p-4 border-b sticky top-0 z-10">
                <h1 className="text-xl font-bold flex items-center gap-2">
                    <Users className="w-6 h-6 text-blue-600" />
                    Komunitas Warga
                </h1>
                <p className="text-sm text-gray-500">
                    Berbagi kabar & tips usaha
                </p>
            </div>

            {/* Input Status */}
            <div className="bg-white p-4 mb-2 shadow-sm">
                <div className="flex gap-3">
                    <Avatar>
                        <AvatarFallback className="bg-blue-600 text-white">
                            S
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <Input
                            placeholder="Apa kabar usaha hari ini?"
                            className="mb-2 bg-gray-50 border-gray-200"
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                        />
                        <div className="flex justify-end">
                            <Button
                                size="sm"
                                onClick={handlePost}
                                disabled={!newPost.trim()}
                                className="bg-blue-600"
                            >
                                <Send className="w-4 h-4 mr-2" /> Posting
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feed */}
            <div className="space-y-3 px-4 py-2">
                {loading ? (
                    <p className="text-center text-gray-400">
                        Memuat diskusi...
                    </p>
                ) : posts.length === 0 ? (
                    <p className="text-center text-gray-400 py-10">
                        Belum ada diskusi.
                    </p>
                ) : (
                    posts.map((post) => (
                        <Card
                            key={post.id}
                            className="p-4 border-none shadow-sm"
                        >
                            <div className="flex gap-3 mb-2">
                                <Avatar className="w-10 h-10">
                                    <AvatarImage src={post.avatar} />
                                    <AvatarFallback>U</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-bold text-sm">
                                        {post.author}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        Warga Lokal
                                    </p>
                                </div>
                            </div>

                            <p className="text-gray-800 text-sm mb-4 leading-relaxed">
                                {post.text}
                            </p>

                            <div className="flex gap-4 border-t pt-3">
                                <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500">
                                    <Heart className="w-4 h-4" /> Suka
                                </button>
                                <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-500">
                                    <MessageSquare className="w-4 h-4" />{" "}
                                    Komentar
                                </button>
                                <button className="flex items-center gap-1 text-xs text-gray-500 ml-auto">
                                    <Share2 className="w-4 h-4" />
                                </button>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
