"use client";

import { useCallback, useEffect, useState } from "react";
import { useI18nStore } from "@/lib/i18n";
import { ClipboardList, ChefHat, Truck, CheckCircle2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Order } from "@/types";

const STATUSES = ["Ordered", "Preparing", "Out for Delivery", "Delivered"];

export function StatusTracker({ initialOrder }: { initialOrder: Order }) {
  const [order, setOrder] = useState(initialOrder);
  const [loading, setLoading] = useState(false);
  const { t } = useI18nStore();

  const fetchStatus = useCallback(async (showToast = false) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/orders/${order.id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.status !== order.status && showToast) {
          toast.success(`Status updated to: ${t(`status${data.status.replace(/ /g, '')}` as keyof typeof t)}`);
        } else if (showToast) {
          toast.info("No change yet");
        }
        setOrder(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [order.id, order.status, t]);

  useEffect(() => {
    if (order.status === "Delivered") return;

    const interval = setInterval(() => {
      fetchStatus(false);
    }, 5000);

    return () => clearInterval(interval);
  }, [order.status, fetchStatus]);

  const currentIdx = STATUSES.indexOf(order.status);

  const getIcon = (status: string, idx: number) => {
    const isActive = idx <= currentIdx;
    const colorClass = isActive ? "text-white" : "text-muted-foreground";
    const bgClass = isActive 
      ? status === "Ordered" ? "bg-rail-blue/80" 
        : status === "Preparing" ? "bg-rail-amber" 
        : status === "Out for Delivery" ? "bg-rail-saffron" 
        : "bg-rail-green"
      : "bg-muted";

    return (
      <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 ${bgClass} ${colorClass} transition-colors duration-500 shadow-md`}>
        {status === "Ordered" && <ClipboardList size={24} />}
        {status === "Preparing" && <ChefHat size={24} />}
        {status === "Out for Delivery" && <Truck size={24} />}
        {status === "Delivered" && <CheckCircle2 size={24} />}
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-rail-blue-dark">Order Status</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => fetchStatus(true)}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          {t("refreshStatus")}
        </Button>
      </div>

      <div className="relative flex justify-between items-center w-full mb-8">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted -z-0"></div>
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-rail-blue -z-0 transition-all duration-500"
          style={{ width: `${(currentIdx / (STATUSES.length - 1)) * 100}%` }}
        ></div>

        {STATUSES.map((status, idx) => (
          <div key={status} className="flex flex-col items-center gap-2 relative z-10 bg-white px-2">
            {getIcon(status, idx)}
            <span className={`text-xs sm:text-sm font-medium text-center ${idx <= currentIdx ? "text-foreground" : "text-muted-foreground"}`}>
              {t(`status${status.replace(/ /g, '')}` as keyof typeof t) || status}
            </span>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center mt-6">
        <Badge 
          className={`text-lg px-6 py-2 text-white ${
            order.status === "Ordered" ? "bg-rail-blue/80" 
            : order.status === "Preparing" ? "bg-rail-amber" 
            : order.status === "Out for Delivery" ? "bg-rail-saffron" 
            : "bg-rail-green hover:bg-rail-green/90"
          }`}
        >
          {t(`status${order.status.replace(/ /g, '')}` as keyof typeof t)}
        </Badge>
      </div>
    </div>
  );
}
