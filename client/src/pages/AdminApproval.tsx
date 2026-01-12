import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { 
  CheckCircle, XCircle, Clock, Users, Mail, Phone, Building, 
  ArrowLeft, Loader2, AlertCircle, Shield
} from "lucide-react";
import { CinematicLoginBackground } from "@/components/CinematicLoginBackground";
import fcpmsLogo from "@/lib/logo";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RegistrationRequest {
  id: number;
  email: string | null;
  phone: string | null;
  firstName: string;
  lastName: string;
  organization: string | null;
  reason: string | null;
  status: string;
  createdAt: string;
}

interface User {
  id: number;
  email: string | null;
  phone: string | null;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  createdAt: string;
}

export default function AdminApproval() {
  const [, setLocation] = useLocation();
  const [registrations, setRegistrations] = useState<RegistrationRequest[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"pending" | "users">("pending");
  const [selectedRequest, setSelectedRequest] = useState<RegistrationRequest | null>(null);
  const [notes, setNotes] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = currentUser.role === "super_admin" || currentUser.role === "admin";

  useEffect(() => {
    if (!isAdmin) {
      setLocation("/");
      return;
    }
    fetchData();
  }, [isAdmin, setLocation]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [regRes, usersRes] = await Promise.all([
        fetch("/api/admin/registrations"),
        fetch("/api/admin/users"),
      ]);
      const regData = await regRes.json();
      const usersData = await usersRes.json();
      setRegistrations(regData);
      setUsers(usersData);
    } catch {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: "approve" | "reject") => {
    if (!selectedRequest) return;
    setActionLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/registrations/${selectedRequest.id}/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId: currentUser.id, notes }),
      });
      const data = await response.json();

      if (data.success) {
        setSelectedRequest(null);
        setNotes("");
        fetchData();
      } else {
        setError(data.error || "Action failed");
      }
    } catch {
      setError("Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen relative overflow-hidden">
      <CinematicLoginBackground />
      
      <div className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setLocation("/")}
                variant="ghost"
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full scale-125" />
                  <div className="relative w-16 h-16 overflow-hidden rounded-lg">
                    <img src={fcpmsLogo} alt="FCPMS Logo" className="w-full h-full object-contain" style={{filter: "drop-shadow(0 0 6px rgba(34, 197, 94, 0.5))"}} />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                  <p className="text-white/60 text-sm">Manage registrations and users</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <Shield className="w-4 h-4 text-[#22C55E]" />
              <span className="text-sm">{currentUser.email || currentUser.phone}</span>
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            <Button
              onClick={() => setActiveTab("pending")}
              variant={activeTab === "pending" ? "default" : "ghost"}
              className={activeTab === "pending" 
                ? "bg-[#22C55E] hover:bg-[#16A34A] text-white" 
                : "text-white hover:bg-white/10"}
            >
              <Clock className="w-4 h-4 mr-2" />
              Pending Requests
              {registrations.length > 0 && (
                <Badge className="ml-2 bg-amber-500 text-white">{registrations.length}</Badge>
              )}
            </Button>
            <Button
              onClick={() => setActiveTab("users")}
              variant={activeTab === "users" ? "default" : "ghost"}
              className={activeTab === "users" 
                ? "bg-[#22C55E] hover:bg-[#16A34A] text-white" 
                : "text-white hover:bg-white/10"}
            >
              <Users className="w-4 h-4 mr-2" />
              All Users
              <Badge className="ml-2 bg-slate-500 text-white">{users.length}</Badge>
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-[#22C55E] animate-spin" />
            </div>
          ) : error ? (
            <Alert variant="destructive" className="bg-red-500/20 border-red-400/30">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : activeTab === "pending" ? (
            <div className="space-y-4">
              {registrations.length === 0 ? (
                <Card className="bg-slate-900/70 backdrop-blur-xl border-white/20">
                  <CardContent className="py-12 text-center">
                    <CheckCircle className="w-12 h-12 text-[#22C55E] mx-auto mb-4" />
                    <p className="text-white/60">No pending registration requests</p>
                  </CardContent>
                </Card>
              ) : (
                registrations.map((request) => (
                  <Card key={request.id} className="bg-slate-900/70 backdrop-blur-xl border-white/20">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold text-white">
                              {request.firstName} {request.lastName}
                            </h3>
                            <Badge variant="outline" className="border-amber-400 text-amber-400">
                              <Clock className="w-3 h-3 mr-1" />
                              Pending
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-white/70">
                            {request.email && (
                              <div className="flex items-center gap-1">
                                <Mail className="w-4 h-4 text-[#4ADE80]" />
                                {request.email}
                              </div>
                            )}
                            {request.phone && (
                              <div className="flex items-center gap-1">
                                <Phone className="w-4 h-4 text-[#4ADE80]" />
                                {request.phone}
                              </div>
                            )}
                            {request.organization && (
                              <div className="flex items-center gap-1">
                                <Building className="w-4 h-4 text-[#4ADE80]" />
                                {request.organization}
                              </div>
                            )}
                          </div>
                          {request.reason && (
                            <p className="text-white/60 text-sm italic">"{request.reason}"</p>
                          )}
                          <p className="text-white/40 text-xs">
                            Submitted: {formatDate(request.createdAt)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => setSelectedRequest(request)}
                            size="sm"
                            className="bg-[#22C55E] hover:bg-[#16A34A] text-white"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => { setSelectedRequest(request); }}
                            size="sm"
                            variant="destructive"
                            className="bg-red-600 hover:bg-red-700"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          ) : (
            <Card className="bg-slate-900/70 backdrop-blur-xl border-white/20">
              <CardHeader>
                <CardTitle className="text-white">All Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left text-white/60 text-sm py-3 px-2">Name</th>
                        <th className="text-left text-white/60 text-sm py-3 px-2">Contact</th>
                        <th className="text-left text-white/60 text-sm py-3 px-2">Role</th>
                        <th className="text-left text-white/60 text-sm py-3 px-2">Status</th>
                        <th className="text-left text-white/60 text-sm py-3 px-2">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-white/5 hover:bg-white/5">
                          <td className="py-3 px-2 text-white">
                            {user.firstName} {user.lastName}
                          </td>
                          <td className="py-3 px-2 text-white/70 text-sm">
                            {user.email || user.phone}
                          </td>
                          <td className="py-3 px-2">
                            <Badge variant="outline" className={
                              user.role === "super_admin" 
                                ? "border-purple-400 text-purple-400"
                                : user.role === "admin"
                                ? "border-blue-400 text-blue-400"
                                : "border-slate-400 text-slate-400"
                            }>
                              {user.role}
                            </Badge>
                          </td>
                          <td className="py-3 px-2">
                            <Badge variant="outline" className={
                              user.status === "approved"
                                ? "border-green-400 text-green-400"
                                : user.status === "pending"
                                ? "border-amber-400 text-amber-400"
                                : "border-red-400 text-red-400"
                            }>
                              {user.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-2 text-white/40 text-sm">
                            {formatDate(user.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={!!selectedRequest} onOpenChange={() => { setSelectedRequest(null); setNotes(""); }}>
        <DialogContent className="bg-slate-900 border-white/20 text-white">
          <DialogHeader>
            <DialogTitle>Review Registration Request</DialogTitle>
            <DialogDescription className="text-white/60">
              {selectedRequest?.firstName} {selectedRequest?.lastName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2 text-sm">
              <div className="flex gap-2">
                <span className="text-white/60">Contact:</span>
                <span>{selectedRequest?.email || selectedRequest?.phone}</span>
              </div>
              {selectedRequest?.organization && (
                <div className="flex gap-2">
                  <span className="text-white/60">Organization:</span>
                  <span>{selectedRequest.organization}</span>
                </div>
              )}
              {selectedRequest?.reason && (
                <div className="flex gap-2">
                  <span className="text-white/60">Reason:</span>
                  <span>"{selectedRequest.reason}"</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm text-white/60">Admin Notes (optional)</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about this decision..."
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              onClick={() => handleAction("reject")}
              disabled={actionLoading}
              variant="destructive"
            >
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Reject"}
            </Button>
            <Button
              onClick={() => handleAction("approve")}
              disabled={actionLoading}
              className="bg-[#22C55E] hover:bg-[#16A34A]"
            >
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Approve"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
