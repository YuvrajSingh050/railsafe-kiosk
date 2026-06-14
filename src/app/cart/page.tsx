"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useSessionStore } from "@/store/sessionStore";
import { useI18nStore } from "@/lib/i18n";
import { CartItem } from "@/components/cart/CartItem";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Receipt, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CartPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const { trainNumber, coachNumber } = useSessionStore();
  const { t } = useI18nStore();
  
  const [seatNumber, setSeatNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
        <Receipt size={64} className="text-muted-foreground mb-4 opacity-50" />
        <h2 className="text-2xl font-bold mb-2">{t("emptyCart")}</h2>
        <Link href="/menu">
          <Button size="lg" className="mt-6">
            <ArrowLeft className="mr-2" size={20} />
            Back to Menu
          </Button>
        </Link>
      </div>
    );
  }

  const handleGenerateBill = async () => {
    if (!seatNumber) return;
    if (!trainNumber || !coachNumber) {
      toast.error("Session expired. Please start over.");
      router.push("/");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trainNumber,
          coachNumber,
          seatNumber,
          items: items.map(item => ({
            menuItemId: item.menuItemId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        }),
      });

      if (!res.ok) throw new Error("Failed to create order");
      
      const order = await res.json();
      clearCart();
      toast.success("Bill generated successfully!");
      router.push(`/order/${order.id}`);
      
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate bill. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center gap-4 mb-8 pb-4 border-b border-slate-200">
        <Button variant="outline" size="icon" onClick={() => router.back()} className="text-rail-blue border-rail-blue hover:bg-rail-blue/10">
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-3xl font-bold text-rail-blue-dark">{t("cart")}</h1>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 flex flex-col gap-4">
          {items.map(item => (
            <CartItem key={item.menuItemId} item={item} />
          ))}
        </div>

        <div className="md:col-span-1">
          <Card className="sticky top-24 shadow-md">
            <CardHeader className="bg-rail-blue/5 border-b pb-4">
              <CardTitle className="text-rail-blue-dark">{t("checkout")}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="flex justify-between items-center text-lg font-bold border-b pb-4">
                <span>{t("total")}</span>
                <span className="text-primary text-2xl">₹{getTotal()}</span>
              </div>

              <div className="space-y-3">
                <Label htmlFor="seatNumber" className="text-base text-slate-800 font-semibold">{t("seatNumber")}</Label>
                <Select value={seatNumber} onValueChange={(val) => { if (val) setSeatNumber(val); }}>
                  <SelectTrigger id="seatNumber" className="h-12 text-lg focus:ring-rail-blue focus:border-rail-blue bg-white text-slate-900 border-slate-300">
                    <SelectValue placeholder={`Select Seat in ${coachNumber}`} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200 max-h-60">
                    {Array.from({length: 72}, (_, i) => `${coachNumber}-${(i + 1).toString().padStart(2, '0')}`).map(seat => (
                      <SelectItem key={seat} value={seat} className="focus:bg-rail-blue/10 cursor-pointer">
                        {seat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="pb-6">
              <Button 
                size="lg" 
                className="w-full h-14 text-lg font-bold shadow-md bg-rail-saffron hover:bg-rail-amber text-white transition-all border-none"
                onClick={handleGenerateBill}
                disabled={!seatNumber || submitting}
              >
                {submitting ? <Loader2 className="animate-spin mr-2" size={20} /> : <Receipt className="mr-2" size={20} />}
                {t("generateBill")}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
