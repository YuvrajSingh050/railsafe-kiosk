"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useI18nStore } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import { toast } from "sonner";

const categories = ["Overcharging", "Quality", "Delay", "Hygiene", "Other"];

function ComplaintFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useI18nStore();
  
  const [orderNumber, setOrderNumber] = useState("");
  const [seatNumber, setSeatNumber] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const orderNum = searchParams.get("orderNumber");
    const seatNum = searchParams.get("seatNumber");
    
    if (orderNum) setOrderNumber(orderNum);
    if (seatNum) setSeatNumber(seatNum);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seatNumber || !category || !description) return;

    try {
      setSubmitting(true);
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber: orderNumber || null,
          seatNumber,
          category,
          description,
        }),
      });

      if (!res.ok) throw new Error("Failed to file complaint");
      
      toast.success("Complaint registered successfully. Our team will look into it.");
      
      // Redirect back home or order page
      setTimeout(() => {
        if (orderNumber) {
          router.back();
        } else {
          router.push("/");
        }
      }, 2000);
      
    } catch (error) {
      console.error(error);
      toast.error("Failed to register complaint. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-lg px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-3xl font-bold text-rail-red">{t("fileComplaint")}</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="shadow-md border-rail-red/20">
          <CardHeader className="bg-rail-red/5 pb-4 border-b">
            <CardTitle>{t("complaintForm")}</CardTitle>
            <CardDescription>
              We take all complaints seriously. Please provide details below.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            
            <div className="space-y-2">
              <Label htmlFor="seatNumber">{t("seatNumber")} <span className="text-rail-red">*</span></Label>
              <Input 
                id="seatNumber" 
                value={seatNumber}
                onChange={(e) => setSeatNumber(e.target.value.toUpperCase())}
                placeholder="E.g. B4-23" 
                className="uppercase"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="orderNumber">Order Number (Optional)</Label>
              <Input 
                id="orderNumber" 
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="E.g. RS-2026..." 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">{t("category")} <span className="text-rail-red">*</span></Label>
              <Select value={category} onValueChange={(val) => { if (val) setCategory(val); }} required>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t("description")} <span className="text-rail-red">*</span></Label>
              <Textarea 
                id="description" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please describe your issue in detail..."
                className="min-h-[120px]"
                required
              />
            </div>

          </CardContent>
          <CardFooter className="pb-6">
            <Button 
              type="submit" 
              size="lg" 
              className="w-full h-12 text-lg bg-rail-red hover:bg-rail-red/90 text-white font-bold border-none"
              disabled={!seatNumber || !category || !description || submitting}
            >
              {submitting ? <Loader2 className="animate-spin mr-2" size={20} /> : <Send className="mr-2" size={20} />}
              {t("submit")}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

export default function ComplaintPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>}>
      <ComplaintFormContent />
    </Suspense>
  );
}
