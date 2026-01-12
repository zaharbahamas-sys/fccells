import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSettings } from "@/contexts/SettingsContext";
import { useAuth } from "@/hooks/use-auth";
import { 
  BookOpen, 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Share2,
  Globe,
  Leaf,
  Zap,
  Plus,
  CheckCircle,
  XCircle,
  Eye,
  Edit3,
  Trash2,
  Send,
  ShieldCheck,
  AlertCircle,
  FileText,
  X,
  Search,
  Filter,
  TrendingUp,
  Users,
  Bookmark,
  Heart,
  MessageCircle,
  Home,
  Newspaper,
  Video,
  Image as ImageIcon,
  Smile
} from "lucide-react";
import { Link } from "wouter";
import { format, formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { PostCard, PostCardSkeleton } from "@/components/blog/PostCard";
import { AdminWorkbench } from "@/components/blog/AdminWorkbench";
import { CommentsSection } from "@/components/ContactComments";

type BlogPost = {
  id: number;
  title: string;
  titleAr: string | null;
  subtitle: string | null;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  imageUrl: string | null;
  authorName: string;
  authorRole: string | null;
  readTime: string | null;
  status: string;
  adminNotes: string | null;
  reviewedBy: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

const CATEGORIES = [
  "Strategic Intelligence",
  "Operational Excellence", 
  "Technical Research",
  "Policy & Regulation",
  "Sustainability",
  "Market Analysis"
];

const categoryPlaceholderImages: Record<string, string> = {
  "Strategic Intelligence": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
  "Operational Excellence": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
  "Technical Research": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
  "Policy & Regulation": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80",
  "Sustainability": "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80",
  "Market Analysis": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
};

const translations = {
  en: {
    blog: "Blog",
    newsFeed: "News Feed",
    forYou: "For You",
    trending: "Trending",
    following: "Following",
    createPost: "Create Post",
    whatsOnYourMind: "What's on your mind?",
    photo: "Photo",
    video: "Video",
    article: "Write Article",
    searchPosts: "Search posts...",
    categories: "Categories",
    trendingTopics: "Trending Topics",
    suggestedAuthors: "Suggested Authors",
    featuredPosts: "Featured Posts",
    recentActivity: "Recent Activity",
    adminPanel: "Admin Panel",
    submitArticle: "Submit Article",
    all: "All",
    noPostsYet: "No posts yet",
    beTheFirst: "Be the first to share your insights!",
    readMore: "Read More",
    like: "Like",
    comment: "Comment",
    share: "Share",
    save: "Save",
    loadMore: "Load More",
    writeArticle: "Write an Article",
    title: "Title",
    titleAr: "Title (Arabic)",
    subtitle: "Subtitle",
    excerpt: "Brief Summary",
    content: "Full Content",
    category: "Category",
    imageUrl: "Cover Image URL",
    authorName: "Author Name",
    submitForReview: "Submit for Review",
    cancel: "Cancel",
    articleSubmitted: "Article submitted for review!",
    close: "Close",
    back: "Back",
    comments: "Comments",
  },
  ar: {
    blog: "المدونة",
    newsFeed: "آخر الأخبار",
    forYou: "لك",
    trending: "الأكثر رواجاً",
    following: "المتابعون",
    createPost: "إنشاء منشور",
    whatsOnYourMind: "بماذا تفكر؟",
    photo: "صورة",
    video: "فيديو",
    article: "كتابة مقال",
    searchPosts: "البحث في المنشورات...",
    categories: "الفئات",
    trendingTopics: "المواضيع الرائجة",
    suggestedAuthors: "كتّاب مقترحون",
    featuredPosts: "مقالات مميزة",
    recentActivity: "النشاط الأخير",
    adminPanel: "لوحة المدير",
    submitArticle: "إرسال مقال",
    all: "الكل",
    noPostsYet: "لا توجد منشورات بعد",
    beTheFirst: "كن أول من يشارك أفكاره!",
    readMore: "اقرأ المزيد",
    like: "إعجاب",
    comment: "تعليق",
    share: "مشاركة",
    save: "حفظ",
    loadMore: "تحميل المزيد",
    writeArticle: "كتابة مقال",
    title: "العنوان",
    titleAr: "العنوان (عربي)",
    subtitle: "العنوان الفرعي",
    excerpt: "ملخص مختصر",
    content: "المحتوى الكامل",
    category: "الفئة",
    imageUrl: "رابط صورة الغلاف",
    authorName: "اسم الكاتب",
    submitForReview: "إرسال للمراجعة",
    cancel: "إلغاء",
    articleSubmitted: "تم إرسال المقال للمراجعة!",
    close: "إغلاق",
    back: "رجوع",
    comments: "التعليقات",
  }
};

function CreatePostCard({ onOpenArticleForm, t, isRTL, user }: { 
  onOpenArticleForm: () => void; 
  t: typeof translations.en;
  isRTL: boolean;
  user: any;
}) {
  return (
    <Card className="border-none shadow-md bg-white mb-4">
      <CardContent className="p-4">
        <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
          <Avatar className="w-10 h-10">
            <AvatarImage src={user?.profilePhoto} />
            <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold">
              {user?.firstName?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <Button 
            variant="outline" 
            className={`flex-1 justify-start text-slate-500 bg-slate-50 hover:bg-slate-100 rounded-full h-10 ${isRTL ? "text-right" : "text-left"}`}
            onClick={onOpenArticleForm}
          >
            {t.whatsOnYourMind}
          </Button>
        </div>
        <div className={`flex items-center justify-between mt-3 pt-3 border-t border-slate-100 ${isRTL ? "flex-row-reverse" : ""}`}>
          <Button variant="ghost" className={`flex-1 gap-2 text-slate-600 hover:bg-red-50 hover:text-red-600 ${isRTL ? "flex-row-reverse" : ""}`}>
            <Video className="w-5 h-5 text-red-500" />
            <span className="hidden sm:inline">{t.video}</span>
          </Button>
          <Button variant="ghost" className={`flex-1 gap-2 text-slate-600 hover:bg-green-50 hover:text-green-600 ${isRTL ? "flex-row-reverse" : ""}`}>
            <ImageIcon className="w-5 h-5 text-green-500" />
            <span className="hidden sm:inline">{t.photo}</span>
          </Button>
          <Button 
            variant="ghost" 
            className={`flex-1 gap-2 text-slate-600 hover:bg-amber-50 hover:text-amber-600 ${isRTL ? "flex-row-reverse" : ""}`}
            onClick={onOpenArticleForm}
          >
            <FileText className="w-5 h-5 text-amber-500" />
            <span className="hidden sm:inline">{t.article}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function LeftSidebar({ t, isRTL, user, selectedCategory, onCategoryChange, isAdmin, onAdminClick }: {
  t: typeof translations.en;
  isRTL: boolean;
  user: any;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  isAdmin: boolean;
  onAdminClick: () => void;
}) {
  return (
    <div className="space-y-4">
      <Card className="border-none shadow-md bg-white overflow-hidden">
        <div className="h-20 bg-gradient-to-r from-emerald-500 to-emerald-600" />
        <CardContent className="p-4 pt-0 -mt-10 text-center">
          <Avatar className="w-20 h-20 mx-auto border-4 border-white shadow-lg">
            <AvatarImage src={user?.profilePhoto} />
            <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-2xl font-bold">
              {user?.firstName?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <h3 className="font-bold text-slate-900 mt-3">{user?.firstName} {user?.lastName}</h3>
          <p className="text-sm text-slate-500">{user?.email}</p>
          {isAdmin && (
            <Badge className="mt-2 bg-emerald-100 text-emerald-700">{isRTL ? "مدير" : "Admin"}</Badge>
          )}
        </CardContent>
      </Card>

      <Card className="border-none shadow-md bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-slate-700">{t.categories}</CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <div className="space-y-1">
            <Button 
              variant={selectedCategory === "" ? "secondary" : "ghost"}
              className={`w-full justify-start text-sm ${isRTL ? "flex-row-reverse" : ""}`}
              onClick={() => onCategoryChange("")}
            >
              <Globe className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2"}`} />
              {t.all}
            </Button>
            {CATEGORIES.map((cat) => (
              <Button 
                key={cat}
                variant={selectedCategory === cat ? "secondary" : "ghost"}
                className={`w-full justify-start text-sm ${isRTL ? "flex-row-reverse" : ""}`}
                onClick={() => onCategoryChange(cat)}
              >
                <FileText className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                {cat}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {isAdmin && (
        <Card className="border-none shadow-md bg-gradient-to-br from-emerald-50 to-white">
          <CardContent className="p-4">
            <Button 
              className="w-full bg-emerald-600 hover:bg-emerald-700 gap-2"
              onClick={onAdminClick}
            >
              <ShieldCheck className="w-4 h-4" />
              {t.adminPanel}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function RightSidebar({ t, isRTL, posts }: {
  t: typeof translations.en;
  isRTL: boolean;
  posts: BlogPost[];
}) {
  const featuredPosts = posts.slice(0, 3);
  
  return (
    <div className="space-y-4">
      <Card className="border-none shadow-md bg-white">
        <CardHeader className="pb-2">
          <CardTitle className={`text-sm font-semibold text-slate-700 flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            {t.trendingTopics}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="space-y-2">
            {["#Hydrogen2025", "#GreenEnergy", "#SudanTelecom", "#FuelCells", "#Sustainability"].map((tag, i) => (
              <div key={tag} className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                <span className="text-sm font-medium text-blue-600 hover:underline cursor-pointer">{tag}</span>
                <span className="text-xs text-slate-400">{Math.floor(Math.random() * 500) + 100} {isRTL ? "منشور" : "posts"}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md bg-white">
        <CardHeader className="pb-2">
          <CardTitle className={`text-sm font-semibold text-slate-700 flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            <Bookmark className="w-4 h-4 text-amber-500" />
            {t.featuredPosts}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2 pt-0">
          <div className="space-y-1">
            {featuredPosts.map((post) => (
              <PostCard key={post.id} post={post} compact />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md bg-white">
        <CardHeader className="pb-2">
          <CardTitle className={`text-sm font-semibold text-slate-700 flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            <Users className="w-4 h-4 text-blue-500" />
            {t.suggestedAuthors}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="space-y-3">
            {[
              { name: "Mohamed Abbas", role: "Energy Strategist" },
              { name: "Sarah Ahmed", role: "Sustainability Expert" },
              { name: "Ali Hassan", role: "Technical Lead" },
            ].map((author) => (
              <div key={author.name} className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                <Avatar className="w-10 h-10">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${author.name}`} />
                  <AvatarFallback>{author.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-slate-900 truncate">{author.name}</p>
                  <p className="text-xs text-slate-500 truncate">{author.role}</p>
                </div>
                <Button size="sm" variant="outline" className="text-xs h-7 px-3">
                  {isRTL ? "متابعة" : "Follow"}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ArticleFormDialog({ open, onOpenChange, t, isRTL, user }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  t: typeof translations.en;
  isRTL: boolean;
  user: any;
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    title: "",
    titleAr: "",
    subtitle: "",
    excerpt: "",
    content: "",
    category: "Strategic Intelligence",
    authorName: user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "",
    authorRole: "Contributor",
    imageUrl: "",
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const res = await fetch("/api/blog/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, slug, status: "pending" }),
      });
      if (!res.ok) throw new Error("Failed to submit article");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blog/posts/pending"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blog/posts/published"] });
      toast({ title: t.articleSubmitted });
      onOpenChange(false);
      setFormData({
        title: "",
        titleAr: "",
        subtitle: "",
        excerpt: "",
        content: "",
        category: "Strategic Intelligence",
        authorName: user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "",
        authorRole: "Contributor",
        imageUrl: "",
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir={isRTL ? "rtl" : "ltr"}>
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            <FileText className="w-5 h-5 text-emerald-600" />
            {t.writeArticle}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(formData); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t.title}</Label>
              <Input 
                value={formData.title} 
                onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label>{t.titleAr}</Label>
              <Input 
                value={formData.titleAr} 
                onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })} 
                dir="rtl"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>{t.subtitle}</Label>
            <Input 
              value={formData.subtitle} 
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t.authorName}</Label>
              <Input 
                value={formData.authorName} 
                onChange={(e) => setFormData({ ...formData, authorName: e.target.value })} 
                required
              />
            </div>
            <div className="space-y-2">
              <Label>{t.category}</Label>
              <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>{t.excerpt}</Label>
            <Textarea 
              value={formData.excerpt} 
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} 
              required 
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label>{t.content}</Label>
            <Textarea 
              value={formData.content} 
              onChange={(e) => setFormData({ ...formData, content: e.target.value })} 
              required 
              rows={8}
              className="font-mono text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label>{t.imageUrl}</Label>
            <Input 
              value={formData.imageUrl} 
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} 
              placeholder="https://..."
            />
          </div>
          <DialogFooter className={isRTL ? "flex-row-reverse" : ""}>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{t.cancel}</Button>
            <Button type="submit" disabled={createMutation.isPending} className="bg-emerald-600 hover:bg-emerald-700">
              <Send className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2"}`} />
              {t.submitForReview}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function PostDetailView({ post, onClose, t, isRTL }: {
  post: BlogPost;
  onClose: () => void;
  t: typeof translations.en;
  isRTL: boolean;
}) {
  const imageUrl = post.imageUrl || categoryPlaceholderImages[post.category] || categoryPlaceholderImages["Strategic Intelligence"];
  
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="relative">
          <img src={imageUrl} alt={post.title} className="w-full h-64 object-cover" />
          <Button 
            variant="ghost" 
            size="icon"
            className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
            <Badge className="bg-emerald-500 text-white mb-2">{post.category}</Badge>
            <h1 className="text-2xl md:text-3xl font-bold text-white">{post.title}</h1>
            {post.titleAr && <p className="text-white/80 mt-1" dir="rtl">{post.titleAr}</p>}
          </div>
        </div>
        
        <ScrollArea className="h-[calc(90vh-16rem)]">
          <div className="p-6">
            <div className={`flex items-center gap-4 mb-6 pb-6 border-b border-slate-100 ${isRTL ? "flex-row-reverse" : ""}`}>
              <Avatar className="w-12 h-12">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${post.authorName}`} />
                <AvatarFallback>{post.authorName.split(" ").map(n => n[0]).join("")}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-slate-900">{post.authorName}</p>
                <p className="text-sm text-slate-500">
                  {post.publishedAt 
                    ? format(new Date(post.publishedAt), "PPP", { locale: isRTL ? ar : undefined })
                    : format(new Date(post.createdAt), "PPP", { locale: isRTL ? ar : undefined })
                  }
                  {post.readTime && ` • ${post.readTime}`}
                </p>
              </div>
            </div>

            {post.subtitle && (
              <p className="text-lg text-slate-600 italic mb-6">{post.subtitle}</p>
            )}

            <div className="prose prose-slate max-w-none">
              {post.content.split('\n').map((paragraph, i) => (
                paragraph.trim() && <p key={i} className="mb-4 text-slate-700 leading-relaxed">{paragraph}</p>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <h3 className={`font-bold text-lg mb-4 flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <MessageCircle className="w-5 h-5 text-emerald-600" />
                {t.comments}
              </h3>
              <CommentsSection postId={post.id} />
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

export default function Blog() {
  const { language, isRTL } = useSettings();
  const t = translations[language as keyof typeof translations] || translations.en;
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showArticleForm, setShowArticleForm] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const isAdmin = user?.role === "super_admin" || user?.role === "admin";

  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog/posts/published"],
    queryFn: async () => {
      const res = await fetch("/api/blog/posts/published");
      return res.json();
    },
  });

  const filteredPosts = posts.filter(post => {
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.authorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (showAdminPanel && isAdmin) {
    return (
      <div className="min-h-screen bg-slate-100" dir={isRTL ? "rtl" : "ltr"}>
        <Sidebar />
        <main className={`${isRTL ? "mr-20 lg:mr-20" : "ml-20 lg:ml-20"} min-h-screen p-6`}>
          <Button 
            variant="ghost" 
            className={`mb-4 gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
            onClick={() => setShowAdminPanel(false)}
          >
            <ArrowLeft className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
            {t.back}
          </Button>
          <AdminWorkbench onPreview={(post) => setSelectedPost(post)} />
        </main>
        {selectedPost && (
          <PostDetailView 
            post={selectedPost} 
            onClose={() => setSelectedPost(null)} 
            t={t}
            isRTL={isRTL}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100" dir={isRTL ? "rtl" : "ltr"}>
      <Sidebar />
      
      <main className={`${isRTL ? "mr-20 lg:mr-20" : "ml-20 lg:ml-20"} min-h-screen`}>
        <div className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className={`flex items-center justify-between gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                  <Newspaper className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-slate-900">{t.blog}</h1>
              </div>
              
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
                  <Input 
                    placeholder={t.searchPosts}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`${isRTL ? "pr-10" : "pl-10"} bg-slate-50 border-slate-200 rounded-full`}
                  />
                </div>
              </div>

              <Button 
                className="gap-2 bg-emerald-600 hover:bg-emerald-700 rounded-full"
                onClick={() => setShowArticleForm(true)}
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">{t.createPost}</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 ${isRTL ? "lg:flex-row-reverse" : ""}`}>
            <aside className={`hidden lg:block lg:col-span-3 ${isRTL ? "lg:order-3" : ""}`}>
              <div className="sticky top-24">
                <LeftSidebar 
                  t={t} 
                  isRTL={isRTL} 
                  user={user}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  isAdmin={isAdmin}
                  onAdminClick={() => setShowAdminPanel(true)}
                />
              </div>
            </aside>

            <div className={`lg:col-span-6 ${isRTL ? "lg:order-2" : ""}`}>
              <CreatePostCard 
                onOpenArticleForm={() => setShowArticleForm(true)} 
                t={t} 
                isRTL={isRTL}
                user={user}
              />

              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => <PostCardSkeleton key={i} />)}
                </div>
              ) : filteredPosts.length === 0 ? (
                <Card className="border-none shadow-md bg-white">
                  <CardContent className="p-12 text-center">
                    <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{t.noPostsYet}</h3>
                    <p className="text-slate-500 mb-4">{t.beTheFirst}</p>
                    <Button 
                      className="bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => setShowArticleForm(true)}
                    >
                      <Plus className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                      {t.createPost}
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredPosts.map((post) => (
                    <PostCard 
                      key={post.id} 
                      post={post} 
                      onReadMore={(p) => setSelectedPost(p)}
                      onComment={(id) => setSelectedPost(posts.find(p => p.id === id) || null)}
                    />
                  ))}
                </div>
              )}
            </div>

            <aside className={`hidden lg:block lg:col-span-3 ${isRTL ? "lg:order-1" : ""}`}>
              <div className="sticky top-24">
                <RightSidebar t={t} isRTL={isRTL} posts={posts} />
              </div>
            </aside>
          </div>
        </div>
      </main>

      <ArticleFormDialog 
        open={showArticleForm} 
        onOpenChange={setShowArticleForm}
        t={t}
        isRTL={isRTL}
        user={user}
      />

      {selectedPost && (
        <PostDetailView 
          post={selectedPost} 
          onClose={() => setSelectedPost(null)} 
          t={t}
          isRTL={isRTL}
        />
      )}
    </div>
  );
}
