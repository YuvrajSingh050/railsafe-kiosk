import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Receipt, IndianRupee, AlertCircle, TrendingUp } from "lucide-react";
import { AnalyticsData } from "@/types";

export function KPICards({ data }: { data: AnalyticsData["kpis"] }) {
  if (!data) return null;

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-4 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Orders Today</CardTitle>
          <Receipt className="h-4 w-4 text-rail-blue" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-rail-blue-dark">{data.ordersToday}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Revenue Today</CardTitle>
          <IndianRupee className="h-4 w-4 text-rail-saffron" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-rail-blue-dark">₹{data.totalRevenueToday.toLocaleString()}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Complaints</CardTitle>
          <AlertCircle className="h-4 w-4 text-rail-red" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-rail-red">{data.pendingComplaints}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
          <TrendingUp className="h-4 w-4 text-rail-green" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-rail-blue-dark">₹{data.averageOrderValue.toFixed(2)}</div>
        </CardContent>
      </Card>
    </div>
  );
}
