import { useCartStore } from "@/store/cartStore";
import { useI18nStore } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

export function CartBar() {
  const { items, getTotal } = useCartStore();
  const { t } = useI18nStore();

  if (items.length === 0) return null;

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-40">
      <div className="container mx-auto max-w-4xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <ShoppingCart size={32} className="text-primary" />
            <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {totalItems}
            </span>
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">{t("itemsInCart")}</p>
            <p className="text-xl font-bold text-primary">₹{getTotal()}</p>
          </div>
        </div>
        <Link href="/cart" passHref>
          <Button size="lg" className="h-14 px-8 text-lg font-medium shadow-md">
            {t("viewCart")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
