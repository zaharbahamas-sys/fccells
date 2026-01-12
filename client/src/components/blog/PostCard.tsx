import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MoreHorizontal,
  ThumbsUp,
  Clock,
  Globe,
  Eye
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { useSettings } from "@/contexts/SettingsContext";

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
  likes?: number;
  comments?: number;
};

const categoryColors: Record<string, string> = {
  "Strategic Intelligence": "bg-blue-100 text-blue-700 border-blue-200",
  "Operational Excellence": "bg-emerald-100 text-emerald-700 border-emerald-200",
  "Technical Research": "bg-slate-100 text-slate-700 border-slate-200",
  "Policy & Regulation": "bg-purple-100 text-purple-700 border-purple-200",
  "Sustainability": "bg-green-100 text-green-700 border-green-200",
  "Market Analysis": "bg-amber-100 text-amber-700 border-amber-200",
};

const categoryPlaceholderImages: Record<string, string> = {
  "Strategic Intelligence": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
  "Operational Excellence": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
  "Technical Research": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
  "Policy & Regulation": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80",
  "Sustainability": "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80",
  "Market Analysis": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
};

interface PostCardProps {
  post: BlogPost;
  onReadMore?: (post: BlogPost) => void;
  onLike?: (postId: number) => void;
  onComment?: (postId: number) => void;
  onShare?: (post: BlogPost) => void;
  onBookmark?: (postId: number) => void;
  compact?: boolean;
}

export function PostCard({ 
  post, 
  onReadMore, 
  onLike, 
  onComment, 
  onShare,
  onBookmark,
  compact = false 
}: PostCardProps) {
  const { language, isRTL } = useSettings();
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes || Math.floor(Math.random() * 50) + 5);

  const displayTitle = language === "ar" && post.titleAr ? post.titleAr : post.title;
  const imageUrl = post.imageUrl || categoryPlaceholderImages[post.category] || categoryPlaceholderImages["Strategic Intelligence"];
  
  const timeAgo = post.publishedAt 
    ? formatDistanceToNow(new Date(post.publishedAt), { 
        addSuffix: true, 
        locale: language === "ar" ? ar : undefined 
      })
    : formatDistanceToNow(new Date(post.createdAt), { 
        addSuffix: true, 
        locale: language === "ar" ? ar : undefined 
      });

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
    onLike?.(post.id);
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    onBookmark?.(post.id);
  };

  if (compact) {
    return (
      <div 
        className="flex gap-3 p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors group"
        onClick={() => onReadMore?.(post)}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <img 
          src={imageUrl} 
          alt={displayTitle}
          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm text-slate-900 line-clamp-2 group-hover:text-emerald-600 transition-colors">
            {displayTitle}
          </h4>
          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
            <span>{post.authorName}</span>
            <span>•</span>
            <span>{timeAgo}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="border-none shadow-md hover:shadow-lg transition-all duration-300 bg-white overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
      <div className="p-4 pb-2">
        <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
          <Avatar className="w-10 h-10 border-2 border-emerald-100">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${post.authorName}`} />
            <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold">
              {post.authorName.split(" ").map(n => n[0]).join("").toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
              <span className="font-semibold text-slate-900">{post.authorName}</span>
              {post.authorRole && (
                <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                  {post.authorRole}
                </Badge>
              )}
            </div>
            <div className={`flex items-center gap-2 text-xs text-slate-500 ${isRTL ? "flex-row-reverse" : ""}`}>
              <Clock className="w-3 h-3" />
              <span>{timeAgo}</span>
              <Globe className="w-3 h-3" />
              <Badge variant="outline" className={`text-xs ${categoryColors[post.category] || categoryColors["Strategic Intelligence"]}`}>
                {post.category}
              </Badge>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            <MoreHorizontal className="w-5 h-5 text-slate-400" />
          </Button>
        </div>
      </div>

      <div className="px-4 pb-3">
        <h3 
          className="text-lg font-bold text-slate-900 mb-2 cursor-pointer hover:text-emerald-600 transition-colors"
          onClick={() => onReadMore?.(post)}
        >
          {displayTitle}
        </h3>
        {post.subtitle && (
          <p className="text-sm text-slate-600 mb-2">{post.subtitle}</p>
        )}
        <p className="text-slate-600 text-sm line-clamp-3">{post.excerpt}</p>
      </div>

      <div 
        className="relative cursor-pointer group"
        onClick={() => onReadMore?.(post)}
      >
        <img 
          src={imageUrl} 
          alt={displayTitle}
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
          <Button 
            variant="secondary" 
            className="bg-white/90 hover:bg-white text-slate-900"
          >
            <Eye className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2"}`} />
            {language === "ar" ? "اقرأ المزيد" : "Read More"}
          </Button>
        </div>
      </div>

      <div className="px-4 py-2 border-t border-slate-100">
        <div className={`flex items-center justify-between text-sm text-slate-500 ${isRTL ? "flex-row-reverse" : ""}`}>
          <div className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className="flex -space-x-1">
              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                <ThumbsUp className="w-3 h-3 text-white" />
              </div>
              <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                <Heart className="w-3 h-3 text-white" />
              </div>
            </div>
            <span className={isRTL ? "mr-1" : "ml-1"}>{likeCount}</span>
          </div>
          <div className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
            <span>{post.comments || Math.floor(Math.random() * 20)} {language === "ar" ? "تعليق" : "comments"}</span>
            <span>{post.readTime || "5 min read"}</span>
          </div>
        </div>
      </div>

      <div className="px-2 py-1 border-t border-slate-100">
        <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
          <Button 
            variant="ghost" 
            className={`flex-1 gap-2 ${liked ? "text-blue-600" : "text-slate-600"} hover:bg-slate-50`}
            onClick={handleLike}
          >
            <ThumbsUp className={`w-5 h-5 ${liked ? "fill-blue-600" : ""}`} />
            <span className="hidden sm:inline">{language === "ar" ? "إعجاب" : "Like"}</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex-1 gap-2 text-slate-600 hover:bg-slate-50"
            onClick={() => onComment?.(post.id)}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="hidden sm:inline">{language === "ar" ? "تعليق" : "Comment"}</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex-1 gap-2 text-slate-600 hover:bg-slate-50"
            onClick={() => onShare?.(post)}
          >
            <Share2 className="w-5 h-5" />
            <span className="hidden sm:inline">{language === "ar" ? "مشاركة" : "Share"}</span>
          </Button>
          <Button 
            variant="ghost" 
            className={`gap-2 ${bookmarked ? "text-amber-600" : "text-slate-600"} hover:bg-slate-50`}
            onClick={handleBookmark}
          >
            <Bookmark className={`w-5 h-5 ${bookmarked ? "fill-amber-600" : ""}`} />
          </Button>
        </div>
      </div>
    </Card>
  );
}

export function PostCardSkeleton() {
  return (
    <Card className="border-none shadow-md bg-white overflow-hidden animate-pulse">
      <div className="p-4 pb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-200" />
          <div className="flex-1">
            <div className="h-4 bg-slate-200 rounded w-32 mb-2" />
            <div className="h-3 bg-slate-200 rounded w-24" />
          </div>
        </div>
      </div>
      <div className="px-4 pb-3">
        <div className="h-5 bg-slate-200 rounded w-3/4 mb-2" />
        <div className="h-4 bg-slate-200 rounded w-full mb-1" />
        <div className="h-4 bg-slate-200 rounded w-2/3" />
      </div>
      <div className="h-64 bg-slate-200" />
      <div className="px-4 py-3">
        <div className="h-4 bg-slate-200 rounded w-full" />
      </div>
    </Card>
  );
}
