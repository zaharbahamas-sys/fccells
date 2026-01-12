import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MessageCircle, Mail, Phone, User, Send, CheckCircle } from "lucide-react";
import { format } from "date-fns";

type Comment = {
  id: number;
  postId: number;
  authorName: string;
  authorEmail: string | null;
  content: string;
  status: string;
  createdAt: string;
};

interface CommentsProps {
  postId: string | number;
}

const defaultPostIdMap: Record<string, number> = {
  'default-0': 9001,
  'default-1': 9002,
};

export function CommentsSection({ postId }: CommentsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ authorName: "", authorEmail: "", content: "" });

  const numericPostId = typeof postId === 'string' && postId.startsWith('default-') 
    ? defaultPostIdMap[postId] || 9000 
    : postId;

  const { data: comments = [] } = useQuery<Comment[]>({
    queryKey: [`/api/blog/post/${numericPostId}/comments`],
    queryFn: async () => {
      const res = await fetch(`/api/blog/post/${numericPostId}/comments`);
      if (!res.ok) return [];
      return res.json();
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: typeof form) => {
      const res = await fetch(`/api/blog/post/${numericPostId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to submit comment");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/blog/post/${numericPostId}/comments`] });
      toast({ title: "تم النشر | Comment Posted", description: "شكراً لمشاركتك | Thank you for your feedback" });
      setForm({ authorName: "", authorEmail: "", content: "" });
      setIsOpen(false);
    },
    onError: () => {
      toast({ title: "خطأ | Error", description: "فشل في نشر التعليق | Failed to post comment", variant: "destructive" });
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-emerald-500" />
          التعليقات | Comments ({comments.length})
        </h3>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
              <MessageCircle className="w-4 h-4 mr-2" /> أضف تعليق | Add Comment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl text-[#1E3A5F]">أضف تعليقك | Add Your Comment</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); submitMutation.mutate(form); }} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">الاسم | Name *</Label>
                <Input 
                  id="name" 
                  value={form.authorName} 
                  onChange={(e) => setForm({ ...form, authorName: e.target.value })} 
                  required 
                  placeholder="اسمك | Your name"
                  className="bg-white border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني | Email</Label>
                <Input 
                  id="email" 
                  type="email"
                  value={form.authorEmail} 
                  onChange={(e) => setForm({ ...form, authorEmail: e.target.value })} 
                  placeholder="email@example.com"
                  className="bg-white border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="comment">التعليق | Comment *</Label>
                <Textarea 
                  id="comment" 
                  value={form.content} 
                  onChange={(e) => setForm({ ...form, content: e.target.value })} 
                  required 
                  rows={4}
                  placeholder="اكتب تعليقك هنا... | Write your comment here..."
                  className="bg-white border-slate-200"
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={submitMutation.isPending} className="bg-emerald-500 hover:bg-emerald-600 w-full">
                  <Send className="w-4 h-4 mr-2" /> {submitMutation.isPending ? "جاري النشر..." : "نشر التعليق | Post Comment"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {comments.length > 0 ? (
        <div className="space-y-3">
          {comments.map((comment) => (
            <Card key={comment.id} className="bg-slate-50 border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                    {comment.authorName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-slate-800">{comment.authorName}</span>
                      <span className="text-xs text-slate-400">
                        {comment.createdAt ? format(new Date(comment.createdAt), "MMM d, yyyy") : ""}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">{comment.content}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-slate-50 border-dashed border-slate-300">
          <CardContent className="p-8 text-center">
            <MessageCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">لا توجد تعليقات بعد | No comments yet</p>
            <p className="text-slate-400 text-sm">كن أول من يعلق! | Be the first to comment!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export function ContactSection() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });

  const submitMutation = useMutation({
    mutationFn: async (data: typeof form) => {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to send message");
      return res.json();
    },
    onSuccess: () => {
      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      toast({ title: "تم الإرسال | Message Sent", description: "سنتواصل معك قريباً | We'll contact you soon" });
    },
    onError: () => {
      toast({ title: "خطأ | Error", description: "فشل في إرسال الرسالة | Failed to send message", variant: "destructive" });
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) setSubmitted(false); }}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-emerald-500 text-emerald-600 hover:bg-emerald-50">
          <Mail className="w-4 h-4 mr-2" /> تواصل معنا | Contact Us
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl text-[#1E3A5F]">تواصل معنا | Contact Us</DialogTitle>
        </DialogHeader>
        
        {submitted ? (
          <div className="py-8 text-center">
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">شكراً لتواصلك! | Thank You!</h3>
            <p className="text-slate-500">سنقوم بالرد عليك في أقرب وقت ممكن</p>
            <p className="text-slate-400 text-sm">We will respond to you as soon as possible</p>
            <Button onClick={() => setIsOpen(false)} className="mt-6 bg-emerald-500 hover:bg-emerald-600">
              إغلاق | Close
            </Button>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); submitMutation.mutate(form); }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact-name">الاسم | Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input 
                    id="contact-name" 
                    value={form.name} 
                    onChange={(e) => setForm({ ...form, name: e.target.value })} 
                    required 
                    placeholder="اسمك | Your name"
                    className="pl-10 bg-white border-slate-200"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">البريد الإلكتروني | Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input 
                    id="contact-email" 
                    type="email"
                    value={form.email} 
                    onChange={(e) => setForm({ ...form, email: e.target.value })} 
                    required 
                    placeholder="email@example.com"
                    className="pl-10 bg-white border-slate-200"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-phone">رقم الهاتف | Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <Input 
                  id="contact-phone" 
                  value={form.phone} 
                  onChange={(e) => setForm({ ...form, phone: e.target.value })} 
                  placeholder="+249 123 456 789"
                  className="pl-10 bg-white border-slate-200"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-subject">الموضوع | Subject *</Label>
              <Input 
                id="contact-subject" 
                value={form.subject} 
                onChange={(e) => setForm({ ...form, subject: e.target.value })} 
                required 
                placeholder="موضوع رسالتك | Message subject"
                className="bg-white border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-message">الرسالة | Message *</Label>
              <Textarea 
                id="contact-message" 
                value={form.message} 
                onChange={(e) => setForm({ ...form, message: e.target.value })} 
                required 
                rows={4}
                placeholder="اكتب رسالتك هنا... | Write your message here..."
                className="bg-white border-slate-200"
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={submitMutation.isPending} className="bg-emerald-500 hover:bg-emerald-600 w-full">
                <Send className="w-4 h-4 mr-2" /> {submitMutation.isPending ? "جاري الإرسال..." : "إرسال الرسالة | Send Message"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function FloatingContactButton() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <ContactSection />
    </div>
  );
}
