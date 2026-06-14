"use client";

import type { Order } from "@/types";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { UnifiedBill } from "@/components/order/UnifiedBill";
import { StatusTracker } from "@/components/order/StatusTracker";
import { Button } from "@/components/ui/button";
import { Printer, ShieldAlert, Loader2 } from "lucide-react";
import Link from "next/link";
import { useI18nStore } from "@/lib/i18n";

export default function OrderPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [origin, setOrigin] = useState("");
  const { t } = useI18nStore();

  useEffect(() => {
    setOrigin(window.location.origin);
    
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 flex justify-center items-center h-[50vh]">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-destructive">Order Not Found</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="bg-rail-green/10 border border-rail-green/30 text-rail-green px-4 py-3 rounded-md text-center font-bold no-print text-lg">
          Order placed successfully!
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-rail-blue/10 shadow-sm no-print mb-8">
          <StatusTracker initialOrder={order} />
        </div>

        <div>
          <div className="no-print mb-2 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-700">Bill & Kitchen Slip</h2>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-white"
              style={{ backgroundColor: "var(--rail-blue)" }}
            >
              <Printer size={13} />
              Print Bill
            </button>
          </div>
          <UnifiedBill order={order} origin={origin} />
        </div>

        <div className="flex justify-center mt-12 no-print">
          <Link href={`/complaint?orderNumber=${order.orderNumber}&seatNumber=${order.seatNumber}`}>
            <Button variant="ghost" className="text-rail-red hover:text-rail-red hover:bg-rail-red/10">
              <ShieldAlert className="mr-2" size={18} />
              {t("fileComplaint")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
