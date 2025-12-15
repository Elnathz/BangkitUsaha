import { ArrowLeft, TrendingUp, Heart, MessageCircle, Share2, Bookmark, CheckCircle, MoreHorizontal } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';
import { useState } from 'react';

interface Post {
  id: string;
  author: {
    name: string;
    avatar?: string;
    businessName: string;
    verified: boolean;
  };
  content: string;
  image?: string;
  category: string;
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
  isLiked: boolean;
  isBookmarked: boolean;
}

interface TopicDetailProps {
  topicTitle: string;
  topicPosts: number;
  onClose: () => void;
  posts: Post[];
  onLikePost: (id: string) => void;
  onBookmarkPost: (id: string) => void;
  onSharePost: (id: string, name: string) => void;
  onCommentClick: (post: Post) => void;
}

export function CommunityTopicDetail({
  topicTitle,
  topicPosts,
  onClose,
  posts,
  onLikePost,
  onBookmarkPost,
  onSharePost,
  onCommentClick,
}: TopicDetailProps) {
  // Filter posts yang relevan dengan topik (mock data - di real app akan ada tags/keywords)
  const topicRelatedPosts = posts.slice(0, 3); // Simulasi posts terkait topik
  
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [newComment, setNewComment] = useState('');

  // Mock existing comments
  const mockComments = [
    {
      id: '1',
      author: 'Budi Santoso',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi',
      businessName: 'Toko Elektronik Jaya',
      content: 'Setuju banget! Strategi ini sangat membantu untuk UMKM seperti kita.',
      timestamp: '2 jam yang lalu',
      likes: 5,
    },
    {
      id: '2',
      author: 'Rina Wijaya',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rina',
      businessName: 'Kue Rumahan Rina',
      content: 'Terima kasih sharingnya! Saya sudah coba terapkan dan hasilnya bagus 👍',
      timestamp: '5 jam yang lalu',
      likes: 3,
    },
    {
      id: '3',
      author: 'Dedi Prasetyo',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dedi',
      businessName: 'Konveksi Murah Meriah',
      content: 'Ada yang pernah coba untuk produk fashion juga? Share dong pengalamannya',
      timestamp: '1 hari yang lalu',
      likes: 8,
    },
  ];

  const handleCommentClick = (post: Post) => {
    setSelectedPost(post);
    setIsCommentDialogOpen(true);
  };

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      toast.success('Komentar berhasil ditambahkan! 💬');
      setNewComment('');
      setIsCommentDialogOpen(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 z-10">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onClose}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h2 className="font-semibold">{topicTitle}</h2>
            <p className="text-sm text-white/80">{topicPosts} diskusi</p>
          </div>
          <TrendingUp className="w-6 h-6" />
        </div>
      </div>

      {/* Topic Info */}
      <div className="p-4">
        <Card className="p-4 mb-4 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-orange-900 mb-2">Topik Trending</h3>
              <p className="text-sm text-orange-800">
                Topik ini sedang banyak dibahas oleh komunitas UMKM. Ikuti diskusi untuk mendapat insight terbaru!
              </p>
            </div>
          </div>
        </Card>

        {/* Posts */}
        <div className="space-y-4">
          {topicRelatedPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <div className="p-4 pb-3">
                <div className="flex gap-3 mb-3">
                  <Avatar>
                    <AvatarImage src={post.author.avatar} />
                    <AvatarFallback className="bg-indigo-600 text-white">
                      {post.author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{post.author.name}</p>
                      {post.author.verified && (
                        <CheckCircle className="w-4 h-4 text-blue-600 fill-blue-600" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{post.author.businessName}</p>
                    <p className="text-xs text-gray-500">{post.timestamp}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>

                <Badge variant="secondary" className="mb-3 text-xs">
                  {post.category}
                </Badge>

                <p className="text-gray-800 mb-3">{post.content}</p>

                {post.image && (
                  <img
                    src={post.image}
                    alt="Post"
                    className="w-full rounded-lg mb-3"
                  />
                )}

                <div className="flex items-center gap-4 text-sm text-gray-600 pb-3 border-b">
                  <span>{post.likes} suka</span>
                  <span>{post.comments} komentar</span>
                  <span>{post.shares} dibagikan</span>
                </div>

                <div className="flex items-center justify-around pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`flex-1 ${post.isLiked ? 'text-red-600' : ''}`}
                    onClick={() => onLikePost(post.id)}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${post.isLiked ? 'fill-red-600' : ''}`} />
                    Suka
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleCommentClick(post)}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Komentar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1"
                    onClick={() => onSharePost(post.id, post.author.name)}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Bagikan
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-8 w-8 p-0 ${post.isBookmarked ? 'text-indigo-600' : ''}`}
                    onClick={() => onBookmarkPost(post.id)}
                  >
                    <Bookmark className={`w-4 h-4 ${post.isBookmarked ? 'fill-indigo-600' : ''}`} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {topicRelatedPosts.length === 0 && (
          <div className="text-center py-12">
            <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Belum ada diskusi untuk topik ini</p>
          </div>
        )}
      </div>

      {/* Comment Dialog */}
      <Dialog open={isCommentDialogOpen} onOpenChange={setIsCommentDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Komentar ({mockComments.length})</DialogTitle>
            <DialogDescription>
              Lihat komentar dan tulis komentar Anda di bawah ini.
            </DialogDescription>
          </DialogHeader>

          {/* Existing Comments */}
          <div className="space-y-4 my-4">
            {mockComments.map((comment) => (
              <div key={comment.id} className="flex gap-3 pb-4 border-b last:border-b-0">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={comment.avatar} />
                  <AvatarFallback className="bg-blue-600 text-white text-sm">
                    {comment.author.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-lg p-3 mb-1">
                    <p className="font-medium text-sm mb-1">{comment.author}</p>
                    <p className="text-xs text-gray-600 mb-2">{comment.businessName}</p>
                    <p className="text-sm text-gray-800">{comment.content}</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 px-3">
                    <span>{comment.timestamp}</span>
                    <button className="hover:text-red-600 transition-colors">
                      ❤️ {comment.likes}
                    </button>
                    <button className="hover:text-blue-600 transition-colors">
                      Balas
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* New Comment Input */}
          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-2">Tulis Komentar</p>
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Tulis komentar Anda..."
              className="min-h-[80px]"
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCommentDialogOpen(false)}
            >
              Batal
            </Button>
            <Button
              size="sm"
              onClick={handleSubmitComment}
              disabled={!newComment.trim()}
            >
              Kirim Komentar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}