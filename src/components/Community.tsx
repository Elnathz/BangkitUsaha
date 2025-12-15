import { useState } from 'react';
import { 
  ArrowLeft, 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark,
  TrendingUp,
  Users,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Send,
  Image as ImageIcon,
  Award,
  CheckCircle
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner@2.0.3';
import { CommunityTopicDetail } from './CommunityTopicDetail';
import { CommunityGroupDetail } from './CommunityGroupDetail';

interface CommunityProps {
  onClose: () => void;
}

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

interface Comment {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  timestamp: string;
  likes: number;
}

export function Community({ onClose }: CommunityProps) {
  const [selectedTab, setSelectedTab] = useState<'feed' | 'trending' | 'groups'>('feed');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [newPost, setNewPost] = useState({ content: '', category: 'Umum' });
  const [newComment, setNewComment] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [joinedGroups, setJoinedGroups] = useState<string[]>(['1']); // User sudah join grup dengan id '1'

  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: {
        name: 'Ibu Sari',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
        businessName: 'Toko Kue Sari',
        verified: true,
      },
      content: 'Alhamdulillah hari ini berhasil jual 50 box kue lapis! Tips dari saya: konsisten dengan kualitas dan pelayanan. Terima kasih untuk tips dari komunitas ini 🙏',
      image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=600',
      category: 'Sharing Pengalaman',
      likes: 128,
      comments: 24,
      shares: 8,
      timestamp: '2 jam lalu',
      isLiked: false,
      isBookmarked: false,
    },
    {
      id: '2',
      author: {
        name: 'Pak Budi',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
        businessName: 'Keripik Nusantara',
        verified: true,
      },
      content: 'Mau tanya dong, untuk packaging produk makanan yang menarik tapi harganya terjangkau dimana ya? Mohon sarannya teman-teman 🙏',
      category: 'Tanya Jawab',
      likes: 45,
      comments: 32,
      shares: 5,
      timestamp: '4 jam lalu',
      isLiked: false,
      isBookmarked: true,
    },
    {
      id: '3',
      author: {
        name: 'Ibu Dewi',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
        businessName: 'Sambal Dewi',
        verified: false,
      },
      content: 'Tips foto produk: gunakan cahaya alami dari jendela, background polos putih/kayu, dan foto dari berbagai sudut. Hasilnya langsung meningkat penjualan 40%! 📸✨',
      image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600',
      category: 'Tips Bisnis',
      likes: 256,
      comments: 48,
      shares: 67,
      timestamp: '1 hari lalu',
      isLiked: true,
      isBookmarked: true,
    },
    {
      id: '4',
      author: {
        name: 'Pak Ahmad',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        businessName: 'Kopi Seduh Ahmad',
        verified: true,
      },
      content: 'Senang banget bisa ikut webinar digital marketing gratis dari komunitas ini. Ilmunya langsung bisa dipraktekkan dan omzet naik 25%! Thanks admin 🙌',
      category: 'Testimoni',
      likes: 189,
      comments: 56,
      shares: 23,
      timestamp: '2 hari lalu',
      isLiked: false,
      isBookmarked: false,
    },
    {
      id: '5',
      author: {
        name: 'Ibu Fitri',
        businessName: 'Batik Fitri Collection',
        verified: false,
      },
      content: 'Ada yang punya pengalaman ekspor produk ke luar negeri? Share dong prosesnya gimana dan dokumen apa aja yang diperlukan. Pengen coba expand market nih 🌏',
      category: 'Tanya Jawab',
      likes: 67,
      comments: 41,
      shares: 12,
      timestamp: '3 hari lalu',
      isLiked: false,
      isBookmarked: false,
    },
    {
      id: '6',
      author: {
        name: 'Admin Bangkit Usaha',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100',
        businessName: 'Bangkit Usaha',
        verified: true,
      },
      content: '📢 WEBINAR GRATIS: "Strategi Digital Marketing untuk UMKM 2025" - Sabtu, 14 Des 2024, 19:00 WIB. Daftar sekarang, tempat terbatas! Link pendaftaran di komentar 👇',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600',
      category: 'Event',
      likes: 342,
      comments: 87,
      shares: 156,
      timestamp: '5 jam lalu',
      isLiked: false,
      isBookmarked: false,
    },
  ]);

  const trendingTopics = [
    { id: '1', title: 'Tips Meningkatkan Penjualan', posts: 234, icon: TrendingUp },
    { id: '2', title: 'Packaging Ramah Lingkungan', posts: 156, icon: TrendingUp },
    { id: '3', title: 'Digital Marketing UMKM', posts: 189, icon: TrendingUp },
    { id: '4', title: 'Manajemen Keuangan', posts: 145, icon: TrendingUp },
  ];

  const groups = [
    {
      id: '1',
      name: 'UMKM Makanan & Minuman',
      members: 2450,
      posts: 1234,
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200',
    },
    {
      id: '2',
      name: 'Fashion & Kerajinan Tangan',
      members: 1890,
      posts: 892,
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=200',
    },
    {
      id: '3',
      name: 'Digital Marketing UMKM',
      members: 3120,
      posts: 2341,
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200',
    },
    {
      id: '4',
      name: 'Export & Import',
      members: 876,
      posts: 456,
      image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=200',
    },
  ];

  const categories = [
    'Semua',
    'Tips Bisnis',
    'Tanya Jawab',
    'Sharing Pengalaman',
    'Testimoni',
    'Event',
  ];

  const comments: { [key: string]: Comment[] } = {
    '1': [
      {
        id: '1',
        author: 'Pak Budi',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
        content: 'Mantap Bu Sari! Konsistensi memang kunci sukses ya 👍',
        timestamp: '1 jam lalu',
        likes: 12,
      },
      {
        id: '2',
        author: 'Ibu Fitri',
        content: 'Kue lapisnya enak banget! Saya juga pelanggan setia ❤️',
        timestamp: '30 menit lalu',
        likes: 8,
      },
    ],
    '2': [
      {
        id: '1',
        author: 'Ibu Dewi',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
        content: 'Coba cek di Tokopedia Pak, banyak supplier packaging murah dan kualitas bagus',
        timestamp: '3 jam lalu',
        likes: 15,
      },
    ],
  };

  const handleLikePost = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newLiked = !post.isLiked;
        toast.success(newLiked ? 'Postingan disukai ❤️' : 'Batal suka');
        return {
          ...post,
          isLiked: newLiked,
          likes: newLiked ? post.likes + 1 : post.likes - 1,
        };
      }
      return post;
    }));
  };

  const handleBookmarkPost = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newBookmarked = !post.isBookmarked;
        toast.success(newBookmarked ? 'Disimpan ke bookmark 🔖' : 'Dihapus dari bookmark');
        return {
          ...post,
          isBookmarked: newBookmarked,
        };
      }
      return post;
    }));
  };

  const handleSharePost = (postId: string, authorName: string) => {
    toast.success(`Membagikan postingan dari ${authorName}`);
    // Di aplikasi lengkap, ini akan membuka share dialog atau copy link
  };

  const handleCommentClick = (post: Post) => {
    setSelectedPost(post);
    setIsCommentDialogOpen(true);
  };

  const handleCreatePost = () => {
    if (!newPost.content.trim()) {
      toast.error('Konten postingan tidak boleh kosong');
      return;
    }

    const post: Post = {
      id: Date.now().toString(),
      author: {
        name: 'Anda',
        businessName: 'Toko Makanan Ibu Sari',
        verified: true,
      },
      content: newPost.content,
      category: newPost.category,
      likes: 0,
      comments: 0,
      shares: 0,
      timestamp: 'Baru saja',
      isLiked: false,
      isBookmarked: false,
    };

    setPosts([post, ...posts]);
    setIsPostDialogOpen(false);
    setNewPost({ content: '', category: 'Umum' });
    toast.success('Postingan berhasil dibagikan! 🎉');
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    toast.success('Komentar berhasil ditambahkan');
    setNewComment('');
    // Di aplikasi lengkap, ini akan menambah komentar ke database
  };

  const handleJoinGroup = (groupName: string) => {
    toast.success(`Berhasil bergabung dengan grup ${groupName}! 🎉`);
  };

  const handleJoinGroupById = (groupId: string, groupName: string) => {
    if (!joinedGroups.includes(groupId)) {
      setJoinedGroups([...joinedGroups, groupId]);
      toast.success(`Berhasil bergabung dengan grup ${groupName}! 🎉`);
    }
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    if (category === 'Semua') {
      toast.success('Menampilkan semua kategori');
    } else {
      toast.success(`Filter: ${category}`);
    }
  };

  const filteredPosts = posts.filter(post => {
    // Filter berdasarkan search query
    const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter berdasarkan kategori
    const matchesCategory = selectedCategory === 'Semua' || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // If topic is selected, show topic detail
  if (selectedTopic) {
    const topic = trendingTopics.find(t => t.id === selectedTopic);
    if (topic) {
      return (
        <CommunityTopicDetail
          topicTitle={topic.title}
          topicPosts={topic.posts}
          onClose={() => setSelectedTopic(null)}
          posts={posts}
          onLikePost={handleLikePost}
          onBookmarkPost={handleBookmarkPost}
          onSharePost={handleSharePost}
          onCommentClick={handleCommentClick}
        />
      );
    }
  }

  // If group is selected, show group detail
  if (selectedGroup) {
    const group = groups.find(g => g.id === selectedGroup);
    if (group) {
      return (
        <CommunityGroupDetail
          group={group}
          onClose={() => setSelectedGroup(null)}
          posts={posts}
          onLikePost={handleLikePost}
          onBookmarkPost={handleBookmarkPost}
          onSharePost={handleSharePost}
          onCommentClick={handleCommentClick}
          isJoined={joinedGroups.includes(selectedGroup)}
          onJoinGroup={(groupId, groupName) => {
            handleJoinGroupById(groupId, groupName);
          }}
        />
      );
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 z-10">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onClose}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="flex-1">Komunitas UMKM</h2>
          <Button 
            size="sm" 
            variant="secondary"
            onClick={() => setIsPostDialogOpen(true)}
          >
            <Plus className="w-4 h-4 mr-1" />
            Post
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Cari diskusi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white text-gray-900 placeholder:text-gray-500"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as any)} className="bg-white">
        <TabsList className="w-full grid grid-cols-3 h-auto px-4">
          <TabsTrigger value="feed" className="py-3">
            <MessageCircle className="w-4 h-4 mr-2" />
            Feed
          </TabsTrigger>
          <TabsTrigger value="trending" className="py-3">
            <TrendingUp className="w-4 h-4 mr-2" />
            Trending
          </TabsTrigger>
          <TabsTrigger value="groups" className="py-3">
            <Users className="w-4 h-4 mr-2" />
            Grup
          </TabsTrigger>
        </TabsList>

        {/* Feed Tab */}
        <TabsContent value="feed" className="p-4 space-y-4 mt-0">
          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                className={`whitespace-nowrap cursor-pointer transition-all ${
                  selectedCategory === category 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                    : 'hover:bg-indigo-50'
                }`}
                onClick={() => handleCategorySelect(category)}
              >
                {category}
              </Badge>
            ))}
          </div>

          {/* Posts */}
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden">
                {/* Post Header */}
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

                  {/* Category Badge */}
                  <Badge variant="secondary" className="mb-3 text-xs">
                    {post.category}
                  </Badge>

                  {/* Content */}
                  <p className="text-gray-800 mb-3">{post.content}</p>

                  {/* Image */}
                  {post.image && (
                    <img
                      src={post.image}
                      alt="Post"
                      className="w-full rounded-lg mb-3"
                    />
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 pb-3 border-b">
                    <span>{post.likes} suka</span>
                    <span>{post.comments} komentar</span>
                    <span>{post.shares} dibagikan</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-around pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`flex-1 ${post.isLiked ? 'text-red-600' : ''}`}
                      onClick={() => handleLikePost(post.id)}
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
                      onClick={() => handleSharePost(post.id, post.author.name)}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Bagikan
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-8 w-8 p-0 ${post.isBookmarked ? 'text-indigo-600' : ''}`}
                      onClick={() => handleBookmarkPost(post.id)}
                    >
                      <Bookmark className={`w-4 h-4 ${post.isBookmarked ? 'fill-indigo-600' : ''}`} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Tidak ada postingan ditemukan</p>
            </div>
          )}
        </TabsContent>

        {/* Trending Tab */}
        <TabsContent value="trending" className="p-4 space-y-4 mt-0">
          <div>
            <h3 className="mb-3">🔥 Topik Trending</h3>
            <div className="space-y-3">
              {trendingTopics.map((topic) => {
                const Icon = topic.icon;
                return (
                  <Card 
                    key={topic.id} 
                    className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedTopic(topic.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium mb-1">{topic.title}</p>
                        <p className="text-sm text-gray-600">{topic.posts} diskusi</p>
                      </div>
                      <TrendingUp className="w-5 h-5 text-orange-600" />
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Popular Posts */}
          <div className="mt-6">
            <h3 className="mb-3">⭐ Postingan Populer Minggu Ini</h3>
            <div className="space-y-3">
              {posts.slice(0, 3).sort((a, b) => b.likes - a.likes).map((post) => (
                <Card key={post.id} className="p-4">
                  <div className="flex gap-3 mb-2">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={post.author.avatar} />
                      <AvatarFallback className="bg-indigo-600 text-white">
                        {post.author.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{post.author.name}</p>
                      <p className="text-xs text-gray-600">{post.author.businessName}</p>
                    </div>
                    <Award className="w-5 h-5 text-orange-500" />
                  </div>
                  <p className="text-sm text-gray-800 line-clamp-2 mb-2">{post.content}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-600">
                    <span>❤️ {post.likes}</span>
                    <span>💬 {post.comments}</span>
                    <span>🔗 {post.shares}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Groups Tab */}
        <TabsContent value="groups" className="p-4 space-y-4 mt-0">
          <div>
            <h3 className="mb-3">👥 Grup Populer</h3>
            <div className="space-y-3">
              {groups.map((group) => {
                const isJoined = joinedGroups.includes(group.id);
                return (
                  <Card key={group.id} className="overflow-hidden">
                    <div className="flex gap-4 p-4">
                      <img
                        src={group.image}
                        alt={group.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="mb-1">{group.name}</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                          <span>👥 {group.members.toLocaleString()} anggota</span>
                          <span>📝 {group.posts} post</span>
                        </div>
                        {isJoined ? (
                          <Button 
                            size="sm" 
                            className="w-full"
                            onClick={() => setSelectedGroup(group.id)}
                          >
                            <Users className="w-4 h-4 mr-2" />
                            Lihat Grup
                          </Button>
                        ) : (
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="flex-1"
                              onClick={() => handleJoinGroupById(group.id, group.name)}
                            >
                              Gabung
                            </Button>
                            <Button 
                              size="sm" 
                              className="flex-1"
                              onClick={() => setSelectedGroup(group.id)}
                            >
                              Lihat
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Suggested Groups */}
          <div className="mt-6">
            <h3 className="mb-3">💡 Rekomendasi Grup</h3>
            <Card className="p-4">
              <p className="text-sm text-gray-600 mb-3">
                Bergabung dengan grup sesuai minat bisnis Anda untuk mendapat insight dan networking lebih baik
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Jelajahi Semua Grup
              </Button>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Post Dialog */}
      <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Buat Postingan Baru</DialogTitle>
            <DialogDescription>Bagikan pengalaman atau tanyakan sesuatu ke komunitas</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Kategori</label>
              <div className="flex gap-2 flex-wrap">
                {['Tips Bisnis', 'Tanya Jawab', 'Sharing Pengalaman', 'Testimoni'].map((cat) => (
                  <Badge
                    key={cat}
                    variant={newPost.category === cat ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setNewPost({ ...newPost, category: cat })}
                  >
                    {cat}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Konten</label>
              <Textarea
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                placeholder="Apa yang ingin Anda bagikan?"
                rows={5}
              />
            </div>

            <Button variant="outline" className="w-full" onClick={() => toast.info('Fitur upload foto akan segera tersedia')}>
              <ImageIcon className="w-4 h-4 mr-2" />
              Tambah Foto
            </Button>

            <Button onClick={handleCreatePost} className="w-full">
              Posting Sekarang
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Comments Dialog */}
      <Dialog open={isCommentDialogOpen} onOpenChange={setIsCommentDialogOpen}>
        <DialogContent className="max-w-sm max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Komentar</DialogTitle>
            <DialogDescription>Lihat dan tambahkan komentar pada postingan ini</DialogDescription>
          </DialogHeader>
          
          {selectedPost && (
            <div className="space-y-4 py-4">
              {/* Original Post */}
              <div className="pb-4 border-b">
                <div className="flex gap-3 mb-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={selectedPost.author.avatar} />
                    <AvatarFallback className="bg-indigo-600 text-white">
                      {selectedPost.author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{selectedPost.author.name}</p>
                    <p className="text-xs text-gray-600">{selectedPost.author.businessName}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-800">{selectedPost.content}</p>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {(comments[selectedPost.id] || []).map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={comment.avatar} />
                      <AvatarFallback className="bg-gray-600 text-white">
                        {comment.author.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-lg p-3">
                        <p className="font-medium text-sm mb-1">{comment.author}</p>
                        <p className="text-sm text-gray-800">{comment.content}</p>
                      </div>
                      <div className="flex items-center gap-3 mt-1 px-3">
                        <button className="text-xs text-gray-600 hover:text-indigo-600">
                          Suka ({comment.likes})
                        </button>
                        <button className="text-xs text-gray-600 hover:text-indigo-600">
                          Balas
                        </button>
                        <span className="text-xs text-gray-500">{comment.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))}

                {(!comments[selectedPost.id] || comments[selectedPost.id].length === 0) && (
                  <p className="text-center text-sm text-gray-500 py-8">
                    Belum ada komentar. Jadilah yang pertama berkomentar!
                  </p>
                )}
              </div>

              {/* Add Comment */}
              <div className="pt-4 border-t sticky bottom-0 bg-white">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Tulis komentar..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                  />
                  <Button size="sm" onClick={handleAddComment}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}