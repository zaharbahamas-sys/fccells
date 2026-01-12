import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSettings } from "@/contexts/SettingsContext";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Edit3, 
  Trash2, 
  Eye,
  AlertCircle,
  Pin,
  Star,
  MessageSquare,
  Users,
  FileText,
  Shield,
  Settings,
  BarChart3
} from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

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

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
  draft: "bg-slate-100 text-slate-700 border-slate-200",
  archived: "bg-gray-100 text-gray-700 border-gray-200",
};

const translations = {
  en: {
    adminWorkbench: "Admin Workbench",
    pendingApproval: "Pending Approval",
    allPosts: "All Posts", 
    comments: "Comments",
    analytics: "Analytics",
    settings: "Settings",
    approve: "Approve",
    reject: "Reject",
    edit: "Edit",
    delete: "Delete",
    preview: "Preview",
    feature: "Feature",
    pin: "Pin to Top",
    archive: "Archive",
    restore: "Restore",
    noPending: "No articles pending approval",
    allClear: "All Clear!",
    rejectionNotes: "Rejection Notes",
    rejectionNotesPlaceholder: "Explain why the article was rejected...",
    confirmReject: "Confirm Rejection",
    cancel: "Cancel",
    editPost: "Edit Post",
    saveChanges: "Save Changes",
    postApproved: "Post approved and published!",
    postRejected: "Post rejected with feedback",
    postUpdated: "Post updated successfully",
    postDeleted: "Post deleted",
    loading: "Loading...",
    by: "By",
    submittedOn: "Submitted on",
    publishedOn: "Published on",
    totalPosts: "Total Posts",
    pendingPosts: "Pending",
    publishedPosts: "Published",
    totalViews: "Total Views",
    status: "Status",
    category: "Category",
    author: "Author",
    actions: "Actions",
  },
  ar: {
    adminWorkbench: "لوحة تحكم المدير",
    pendingApproval: "في انتظار الموافقة",
    allPosts: "جميع المقالات",
    comments: "التعليقات",
    analytics: "التحليلات",
    settings: "الإعدادات",
    approve: "موافقة",
    reject: "رفض",
    edit: "تعديل",
    delete: "حذف",
    preview: "معاينة",
    feature: "مميز",
    pin: "تثبيت في الأعلى",
    archive: "أرشفة",
    restore: "استعادة",
    noPending: "لا توجد مقالات في انتظار الموافقة",
    allClear: "كل شيء واضح!",
    rejectionNotes: "ملاحظات الرفض",
    rejectionNotesPlaceholder: "اشرح سبب رفض المقالة...",
    confirmReject: "تأكيد الرفض",
    cancel: "إلغاء",
    editPost: "تعديل المقال",
    saveChanges: "حفظ التغييرات",
    postApproved: "تمت الموافقة على المقال ونشره!",
    postRejected: "تم رفض المقال مع الملاحظات",
    postUpdated: "تم تحديث المقال بنجاح",
    postDeleted: "تم حذف المقال",
    loading: "جاري التحميل...",
    by: "بقلم",
    submittedOn: "تم الإرسال في",
    publishedOn: "تم النشر في",
    totalPosts: "إجمالي المقالات",
    pendingPosts: "قيد الانتظار",
    publishedPosts: "منشور",
    totalViews: "إجمالي المشاهدات",
    status: "الحالة",
    category: "الفئة",
    author: "الكاتب",
    actions: "الإجراءات",
  }
};

interface AdminWorkbenchProps {
  onPreview?: (post: BlogPost) => void;
}

export function AdminWorkbench({ onPreview }: AdminWorkbenchProps) {
  const { language, isRTL } = useSettings();
  const t = translations[language as keyof typeof translations] || translations.en;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState("pending");
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [rejectNotes, setRejectNotes] = useState("");
  const [editFormData, setEditFormData] = useState<Partial<BlogPost>>({});

  const { data: pendingPosts = [], isLoading: pendingLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog/posts/pending"],
    queryFn: async () => {
      const res = await fetch("/api/blog/posts/pending");
      return res.json();
    },
  });

  const { data: allPosts = [], isLoading: allLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog/posts"],
    queryFn: async () => {
      const res = await fetch("/api/blog/posts");
      return res.json();
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/blog/post/${id}/approve`, { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ reviewedBy: "Admin" }) 
      });
      if (!res.ok) throw new Error("Failed to approve");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blog/posts/pending"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blog/posts/published"] });
      toast({ title: t.postApproved });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: number; notes: string }) => {
      const res = await fetch(`/api/blog/post/${id}/reject`, { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ reviewedBy: "Admin", notes }) 
      });
      if (!res.ok) throw new Error("Failed to reject");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blog/posts/pending"] });
      toast({ title: t.postRejected });
      setRejectDialogOpen(false);
      setRejectNotes("");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<BlogPost> }) => {
      const res = await fetch(`/api/blog/post/${id}`, { 
        method: "PATCH", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(data) 
      });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blog/posts/pending"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blog/posts/published"] });
      toast({ title: t.postUpdated });
      setEditDialogOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/blog/post/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blog/posts/pending"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blog/posts/published"] });
      toast({ title: t.postDeleted });
    },
  });

  const handleReject = (post: BlogPost) => {
    setSelectedPost(post);
    setRejectDialogOpen(true);
  };

  const handleEdit = (post: BlogPost) => {
    setSelectedPost(post);
    setEditFormData({
      title: post.title,
      titleAr: post.titleAr,
      subtitle: post.subtitle,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      imageUrl: post.imageUrl,
      status: post.status,
    });
    setEditDialogOpen(true);
  };

  const publishedCount = allPosts.filter(p => p.status === "approved").length;
  const pendingCount = pendingPosts.length;

  return (
    <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
      <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
        <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
          <Shield className="w-8 h-8 text-emerald-600" />
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{t.adminWorkbench}</h2>
            <p className="text-sm text-slate-500">{language === "ar" ? "إدارة المحتوى والموافقات" : "Manage content and approvals"}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm bg-gradient-to-br from-slate-50 to-white">
          <CardContent className="p-4">
            <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{allPosts.length}</p>
                <p className="text-xs text-slate-500">{t.totalPosts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-gradient-to-br from-amber-50 to-white">
          <CardContent className="p-4">
            <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
                <p className="text-xs text-slate-500">{t.pendingPosts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-gradient-to-br from-emerald-50 to-white">
          <CardContent className="p-4">
            <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-600">{publishedCount}</p>
                <p className="text-xs text-slate-500">{t.publishedPosts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="p-4">
            <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{Math.floor(Math.random() * 5000) + 1000}</p>
                <p className="text-xs text-slate-500">{t.totalViews}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-lg">
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="border-b border-slate-100 px-4">
              <TabsList className="bg-transparent h-12 gap-4">
                <TabsTrigger value="pending" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rounded-none">
                  <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <Clock className="w-4 h-4" />
                    {t.pendingApproval}
                    {pendingCount > 0 && (
                      <Badge className="bg-amber-500 text-white text-xs">{pendingCount}</Badge>
                    )}
                  </div>
                </TabsTrigger>
                <TabsTrigger value="all" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rounded-none">
                  <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <FileText className="w-4 h-4" />
                    {t.allPosts}
                  </div>
                </TabsTrigger>
                <TabsTrigger value="comments" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rounded-none">
                  <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <MessageSquare className="w-4 h-4" />
                    {t.comments}
                  </div>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="pending" className="p-4 m-0">
              {pendingLoading ? (
                <div className="text-center py-8 text-slate-500">{t.loading}</div>
              ) : pendingPosts.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{t.allClear}</h3>
                  <p className="text-slate-500">{t.noPending}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingPosts.map((post) => (
                    <Card key={post.id} className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className={`flex items-start gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                          {post.imageUrl && (
                            <img 
                              src={post.imageUrl} 
                              alt={post.title}
                              className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className={`flex items-start justify-between gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                              <div>
                                <h3 className="font-bold text-lg text-slate-900">{post.title}</h3>
                                {post.titleAr && (
                                  <p className="text-sm text-slate-600 mt-1" dir="rtl">{post.titleAr}</p>
                                )}
                                <p className="text-sm text-slate-500 mt-2 line-clamp-2">{post.excerpt}</p>
                                <div className={`flex items-center gap-4 mt-3 text-xs text-slate-500 ${isRTL ? "flex-row-reverse" : ""}`}>
                                  <span>{t.by} {post.authorName}</span>
                                  <Badge variant="outline" className={statusColors[post.status]}>{post.status}</Badge>
                                  <Badge variant="outline">{post.category}</Badge>
                                  <span>{t.submittedOn} {format(new Date(post.createdAt), "PPP", { locale: language === "ar" ? ar : undefined })}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className={`flex flex-col gap-2 ${isRTL ? "items-start" : "items-end"}`}>
                            <Button 
                              size="sm" 
                              className="bg-emerald-600 hover:bg-emerald-700 w-full"
                              onClick={() => approveMutation.mutate(post.id)}
                              disabled={approveMutation.isPending}
                            >
                              <CheckCircle className={`w-4 h-4 ${isRTL ? "ml-1" : "mr-1"}`} />
                              {t.approve}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              className="w-full"
                              onClick={() => handleReject(post)}
                            >
                              <XCircle className={`w-4 h-4 ${isRTL ? "ml-1" : "mr-1"}`} />
                              {t.reject}
                            </Button>
                            <div className={`flex gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                              <Button size="sm" variant="outline" onClick={() => onPreview?.(post)}>
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleEdit(post)}>
                                <Edit3 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="all" className="p-4 m-0">
              {allLoading ? (
                <div className="text-center py-8 text-slate-500">{t.loading}</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className={`px-4 py-3 text-xs font-medium text-slate-500 uppercase ${isRTL ? "text-right" : "text-left"}`}>{language === "ar" ? "العنوان" : "Title"}</th>
                        <th className={`px-4 py-3 text-xs font-medium text-slate-500 uppercase ${isRTL ? "text-right" : "text-left"}`}>{t.author}</th>
                        <th className={`px-4 py-3 text-xs font-medium text-slate-500 uppercase ${isRTL ? "text-right" : "text-left"}`}>{t.category}</th>
                        <th className={`px-4 py-3 text-xs font-medium text-slate-500 uppercase ${isRTL ? "text-right" : "text-left"}`}>{t.status}</th>
                        <th className={`px-4 py-3 text-xs font-medium text-slate-500 uppercase ${isRTL ? "text-right" : "text-left"}`}>{language === "ar" ? "التاريخ" : "Date"}</th>
                        <th className={`px-4 py-3 text-xs font-medium text-slate-500 uppercase ${isRTL ? "text-right" : "text-left"}`}>{t.actions}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {allPosts.map((post) => (
                        <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-medium text-slate-900 line-clamp-1">{post.title}</div>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">{post.authorName}</td>
                          <td className="px-4 py-3">
                            <Badge variant="outline" className="text-xs">{post.category}</Badge>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant="outline" className={`text-xs ${statusColors[post.status]}`}>{post.status}</Badge>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-500">
                            {format(new Date(post.createdAt), "PP", { locale: language === "ar" ? ar : undefined })}
                          </td>
                          <td className="px-4 py-3">
                            <div className={`flex gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                              <Button size="sm" variant="ghost" onClick={() => onPreview?.(post)}>
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => handleEdit(post)}>
                                <Edit3 className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700" onClick={() => deleteMutation.mutate(post.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>

            <TabsContent value="comments" className="p-4 m-0">
              <div className="text-center py-12 text-slate-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <p>{language === "ar" ? "إدارة التعليقات قريباً" : "Comment management coming soon"}</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent dir={isRTL ? "rtl" : "ltr"}>
          <DialogHeader>
            <DialogTitle>{t.reject}: {selectedPost?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t.rejectionNotes}</Label>
              <Textarea 
                value={rejectNotes}
                onChange={(e) => setRejectNotes(e.target.value)}
                placeholder={t.rejectionNotesPlaceholder}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter className={isRTL ? "flex-row-reverse" : ""}>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>{t.cancel}</Button>
            <Button 
              variant="destructive" 
              onClick={() => selectedPost && rejectMutation.mutate({ id: selectedPost.id, notes: rejectNotes })}
              disabled={rejectMutation.isPending}
            >
              {t.confirmReject}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir={isRTL ? "rtl" : "ltr"}>
          <DialogHeader>
            <DialogTitle>{t.editPost}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{language === "ar" ? "العنوان (إنجليزي)" : "Title (English)"}</Label>
                <Input 
                  value={editFormData.title || ""}
                  onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>{language === "ar" ? "العنوان (عربي)" : "Title (Arabic)"}</Label>
                <Input 
                  value={editFormData.titleAr || ""}
                  onChange={(e) => setEditFormData({...editFormData, titleAr: e.target.value})}
                  dir="rtl"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{language === "ar" ? "العنوان الفرعي" : "Subtitle"}</Label>
              <Input 
                value={editFormData.subtitle || ""}
                onChange={(e) => setEditFormData({...editFormData, subtitle: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t.category}</Label>
                <Select 
                  value={editFormData.category} 
                  onValueChange={(v) => setEditFormData({...editFormData, category: v})}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t.status}</Label>
                <Select 
                  value={editFormData.status} 
                  onValueChange={(v) => setEditFormData({...editFormData, status: v})}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">{language === "ar" ? "قيد الانتظار" : "Pending"}</SelectItem>
                    <SelectItem value="approved">{language === "ar" ? "منشور" : "Published"}</SelectItem>
                    <SelectItem value="rejected">{language === "ar" ? "مرفوض" : "Rejected"}</SelectItem>
                    <SelectItem value="draft">{language === "ar" ? "مسودة" : "Draft"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>{language === "ar" ? "الملخص" : "Excerpt"}</Label>
              <Textarea 
                value={editFormData.excerpt || ""}
                onChange={(e) => setEditFormData({...editFormData, excerpt: e.target.value})}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>{language === "ar" ? "المحتوى" : "Content"}</Label>
              <Textarea 
                value={editFormData.content || ""}
                onChange={(e) => setEditFormData({...editFormData, content: e.target.value})}
                rows={8}
              />
            </div>
            <div className="space-y-2">
              <Label>{language === "ar" ? "رابط الصورة" : "Image URL"}</Label>
              <Input 
                value={editFormData.imageUrl || ""}
                onChange={(e) => setEditFormData({...editFormData, imageUrl: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter className={isRTL ? "flex-row-reverse" : ""}>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>{t.cancel}</Button>
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={() => selectedPost && updateMutation.mutate({ id: selectedPost.id, data: editFormData })}
              disabled={updateMutation.isPending}
            >
              {t.saveChanges}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
