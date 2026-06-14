export interface MenuItem {
  id: string;
  itemCode: string;
  name: string;
  nameHindi?: string | null;
  category: string;
  price: number;
  description?: string | null;
  imageUrl?: string | null;
  isVeg: boolean;
  isAvailable: boolean;
  createdAt: Date;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  seatNumber: string;
  coachNumber: string;
  trainNumber: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Complaint {
  id: string;
  orderNumber?: string | null;
  seatNumber: string;
  category: string;
  description: string;
  status: string;
  createdAt: Date;
}

export interface TopItem {
  name: string;
  quantity: number;
  revenue: number;
}

export interface AnalyticsData {
  kpis: {
    ordersToday: number;
    totalRevenueToday: number;
    pendingComplaints: number;
    averageOrderValue: number;
  };
  charts: {
    revenueByDay: { date: string; revenue: number }[];
    topItems: TopItem[];
    ordersPerStatus: { name: string; value: number }[];
  };
}
