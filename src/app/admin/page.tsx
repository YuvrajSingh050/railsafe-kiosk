"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KPICards } from "@/components/admin/KPICards";
import { OrdersTable } from "@/components/admin/OrdersTable";
import { ComplaintsTable } from "@/components/admin/ComplaintsTable";
import { AnalyticsCharts } from "@/components/admin/AnalyticsCharts";
import { DemoBanner } from "@/components/admin/DemoBanner";
import { ResetDialog } from "@/components/admin/ResetDialog";
import { Loader2, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { Order, Complaint, AnalyticsData } from "@/types";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [resetOpen, setResetOpen] = useState(false);

  useEffect(() => {
    const auth = sessionStorage.getItem("railsafe_admin_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
      fetchDashboardData();
    } else {
      setLoading(false);
    }
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(() => {
      if (sessionStorage.getItem("railsafe_admin_auth") === "true") {
        fetchDashboardData(false);
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // DEMO-ONLY AUTH: Not secure. For production, replace with proper session-based authentication.
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";
    if (password === adminPassword) {
      sessionStorage.setItem("railsafe_admin_auth", "true");
      setIsAuthenticated(true);
      toast.success("Logged in successfully");
      fetchDashboardData();
    } else {
      toast.error("Invalid password");
    }
  };

  const fetchDashboardData = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const [analyticsRes, ordersRes, complaintsRes] = await Promise.all([
        fetch("/api/analytics"),
        fetch("/api/orders"),
        fetch("/api/complaints")
      ]);

      if (analyticsRes.ok) setData(await analyticsRes.json());
      if (ordersRes.ok) setOrders(await ordersRes.json());
      if (complaintsRes.ok) setComplaints(await complaintsRes.json());
      
    } catch (error) {
      console.error(error);
      if (showLoading) toast.error("Failed to fetch dashboard data");
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  if (loading && isAuthenticated) {
    return (
      <div className="container mx-auto px-4 flex justify-center items-center h-[50vh]">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center items-center">
        <Card className="w-full max-w-md shadow-lg border-t-4 border-t-rail-blue">
          <form onSubmit={handleLogin}>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-rail-blue-dark">Admin Login</CardTitle>
              <CardDescription>Enter staff credentials to continue</CardDescription>
            </CardHeader>
            <CardContent>
              <Input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 text-lg"
              />
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Demo authentication only — not for production use.
              </p>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full h-12 text-lg bg-rail-blue hover:bg-rail-blue-dark text-white border-none">Login</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 bg-slate-50 min-h-screen max-w-7xl">
      <DemoBanner />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-rail-blue-dark">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage orders, complaints, and analytics.</p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <Button variant="outline" onClick={() => fetchDashboardData(true)} className="flex items-center gap-2">
            <RefreshCw size={16} />
            Refresh
          </Button>
          <Button variant="destructive" className="flex items-center gap-2" onClick={() => setResetOpen(true)}>
            <Trash2 size={16} />
            Reset Demo Data
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <KPICards data={data?.kpis || { ordersToday: 0, totalRevenueToday: 0, pendingComplaints: 0, averageOrderValue: 0 }} />
      </div>

      <Tabs defaultValue="overview" className="w-full space-y-6">
        <TabsList className="bg-slate-200/50 w-full justify-start h-auto p-1.5 rounded-xl overflow-x-auto flex gap-2 border border-slate-200 shadow-sm mb-6">
          <TabsTrigger value="overview" className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-semibold text-slate-600 hover:bg-white/50 data-[state=active]:bg-rail-blue data-[state=active]:text-white transition-all shadow-sm">Overview</TabsTrigger>
          <TabsTrigger value="orders" className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-semibold text-slate-600 hover:bg-white/50 data-[state=active]:bg-rail-blue data-[state=active]:text-white transition-all shadow-sm">Orders</TabsTrigger>
          <TabsTrigger value="complaints" className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-semibold text-slate-600 hover:bg-white/50 data-[state=active]:bg-rail-blue data-[state=active]:text-white transition-all shadow-sm">Complaints</TabsTrigger>
          <TabsTrigger value="analytics" className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-semibold text-slate-600 hover:bg-white/50 data-[state=active]:bg-rail-blue data-[state=active]:text-white transition-all shadow-sm">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid xl:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Showing latest 5 orders</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <OrdersTable orders={orders.slice(0, 5)} onStatusUpdate={() => fetchDashboardData(false)} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Open Complaints</CardTitle>
                <CardDescription>Latest complaints requiring attention</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ComplaintsTable 
                  complaints={complaints.filter(c => c.status === "Open").slice(0, 5)} 
                  onStatusUpdate={() => fetchDashboardData(false)} 
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>All Orders</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <OrdersTable orders={orders} onStatusUpdate={() => fetchDashboardData(false)} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="complaints">
          <Card>
            <CardHeader>
              <CardTitle>All Complaints</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ComplaintsTable complaints={complaints} onStatusUpdate={() => fetchDashboardData(false)} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <AnalyticsCharts data={data?.charts || { revenueByDay: [], topItems: [], ordersPerStatus: [] }} />
        </TabsContent>
      </Tabs>

      <ResetDialog 
        open={resetOpen} 
        onOpenChange={setResetOpen} 
        onSuccess={() => fetchDashboardData(true)} 
      />
    </div>
  );
}
