import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [ordersToday, revenueTodayObj, pendingComplaints, allOrders] = await Promise.all([
      prisma.order.count({ where: { createdAt: { gte: today } } }),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { createdAt: { gte: today } },
      }),
      prisma.complaint.count({ where: { status: "Open" } }),
      prisma.order.findMany(),
    ]);

    const totalRevenueToday = revenueTodayObj._sum.totalAmount || 0;
    const averageOrderValue = ordersToday > 0 ? totalRevenueToday / ordersToday : 0;

    // Process all orders for charts
    const revenueByDayMap = new Map<string, number>();
    const itemsCountMap = new Map<string, { name: string, quantity: number, revenue: number }>();
    const statusCountMap = new Map<string, number>();

    allOrders.forEach(order => {
      // Revenue by day
      const dateStr = order.createdAt.toISOString().split('T')[0];
      revenueByDayMap.set(dateStr, (revenueByDayMap.get(dateStr) || 0) + order.totalAmount);

      // Status count
      statusCountMap.set(order.status, (statusCountMap.get(order.status) || 0) + 1);

      // Items parsing
      const items = order.items as { menuItemId: string, name: string, quantity: number, price: number }[];
      items.forEach(item => {
        const existing = itemsCountMap.get(item.menuItemId) || { name: item.name, quantity: 0, revenue: 0 };
        existing.quantity += item.quantity;
        existing.revenue += (item.quantity * item.price);
        itemsCountMap.set(item.menuItemId, existing);
      });
    });

    // Last 7 days revenue
    const revenueByDay = Array.from(revenueByDayMap.entries())
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-7);

    const topItems = Array.from(itemsCountMap.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10); // top 10 for table, we can slice top 5 for pie chart on client

    const ordersPerStatus = Array.from(statusCountMap.entries())
      .map(([name, value]) => ({ name, value }));

    return NextResponse.json({
      kpis: {
        ordersToday,
        totalRevenueToday,
        pendingComplaints,
        averageOrderValue
      },
      charts: {
        revenueByDay,
        topItems,
        ordersPerStatus
      }
    });

  } catch (error) {
    console.error("Failed to fetch analytics:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
