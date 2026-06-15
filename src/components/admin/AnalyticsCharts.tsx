import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalyticsData, TopItem } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const COLORS = ['#003366', '#FF7722', '#2E8B57', '#F5A623', '#D32F2F', '#8884d8'];

export function AnalyticsCharts({ data }: { data: AnalyticsData["charts"] }) {
  if (!data) return null;

  const { revenueByDay = [], topItems = [], ordersPerStatus = [] } = data;
  const pieData = topItems.slice(0, 5);

  const renderEmptyState = (message: string) => (
    <div className="flex items-center justify-center h-[300px] w-full text-muted-foreground border border-dashed rounded-lg bg-slate-50">
      {message}
    </div>
  );

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Analytics Overview</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid gap-12 lg:grid-cols-2">
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-slate-700">Revenue (Last 7 Days)</h3>
            <div className="pt-4 pb-2 px-2 border rounded-xl bg-slate-50/50 min-h-[320px] flex items-center justify-center">
              {revenueByDay.length === 0 ? renderEmptyState("No revenue data yet") : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueByDay} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" tick={{fontSize: 12}} tickFormatter={(val) => String(val).split('-').slice(1).join('/')} />
                    <YAxis tick={{fontSize: 12}} />
                    <RechartsTooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                    <Bar dataKey="revenue" fill="#003366" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium text-slate-700">Orders by Status</h3>
            <div className="pt-4 pb-2 px-2 border rounded-xl bg-slate-50/50 min-h-[320px] flex items-center justify-center">
              {ordersPerStatus.length === 0 ? renderEmptyState("No order status data yet") : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={ordersPerStatus} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{fontSize: 12}} />
                    <YAxis tick={{fontSize: 12}} />
                    <RechartsTooltip />
                    <Line type="monotone" dataKey="value" stroke="#FF7722" strokeWidth={3} dot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="space-y-2 lg:col-span-1">
            <h3 className="text-lg font-medium text-slate-700">Top 5 Items (Pie)</h3>
            <div className="pt-4 pb-2 border rounded-xl bg-slate-50/50 flex flex-col items-center justify-center min-h-[320px]">
              {pieData.length === 0 ? renderEmptyState("No items sold yet") : (
                <>
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="quantity"
                      >
                        {pieData.map((entry: TopItem, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {pieData.map((entry: TopItem, index: number) => (
                      <div key={entry.name} className="flex items-center text-xs">
                        <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        {entry.name}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="space-y-2 lg:col-span-1">
            <h3 className="text-lg font-medium text-slate-700">Top 10 Best Sellers</h3>
            <div className="pt-4 border rounded-xl bg-slate-50/50 overflow-hidden h-full">
              {topItems.length === 0 ? renderEmptyState("No items sold yet") : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item Name</TableHead>
                        <TableHead className="text-right">Qty Sold</TableHead>
                        <TableHead className="text-right">Revenue</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topItems.map((item: TopItem) => (
                        <TableRow key={item.name}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right font-bold">₹{item.revenue}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}
