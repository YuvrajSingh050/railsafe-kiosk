import { useI18nStore } from "@/lib/i18n";
import { useCartStore, CartItemType } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { Plus, Minus, X } from "lucide-react";

export function CartItem({ item }: { item: CartItemType }) {
  const { updateQuantity, removeItem } = useCartStore();
  const { language } = useI18nStore();

  const displayName = language === "hi" && item.nameHindi ? item.nameHindi : item.name;

  return (
    <div className="flex items-center justify-between p-4 bg-white border rounded-xl shadow-sm">
      <div className="flex-1 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 border rounded-sm flex items-center justify-center ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
            </div>
            <h4 className="font-semibold">{displayName}</h4>
          </div>
          <p className="text-primary font-bold mt-1">₹{item.price}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 ml-4">
        <div className="flex items-center border rounded-lg overflow-hidden bg-muted/20">
          <Button 
            variant="ghost" 
            size="sm"
            className="rounded-none px-3 h-10" 
            onClick={() => updateQuantity(item.menuItemId, -1)}
          >
            <Minus size={16} />
          </Button>
          <span className="font-semibold text-lg w-8 text-center">{item.quantity}</span>
          <Button 
            variant="ghost" 
            size="sm"
            className="rounded-none px-3 h-10 text-primary" 
            onClick={() => updateQuantity(item.menuItemId, 1)}
          >
            <Plus size={16} />
          </Button>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={() => removeItem(item.menuItemId)}
        >
          <X size={20} />
        </Button>
      </div>
    </div>
  );
}
