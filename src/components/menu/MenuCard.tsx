import { useCartStore } from "@/store/cartStore";
import { useI18nStore } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Plus, Minus } from "lucide-react";

interface MenuCardProps {
  item: {
    id: string;
    itemCode: string;
    name: string;
    nameHindi?: string | null;
    price: number;
    isVeg: boolean;
    imageUrl?: string | null;
  };
}

/* eslint-disable @next/next/no-img-element */
export function MenuCard({ item }: MenuCardProps) {
  const { items, addItem, updateQuantity } = useCartStore();
  const { language, t } = useI18nStore();

  const cartItem = items.find(i => i.menuItemId === item.id);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = () => {
    addItem({
      menuItemId: item.id,
      name: item.name,
      nameHindi: item.nameHindi || undefined,
      price: item.price,
      isVeg: item.isVeg,
    });
  };

  const displayName = language === "hi" && item.nameHindi ? item.nameHindi : item.name;
  const subtitleName = language === "en" && item.nameHindi ? item.nameHindi : item.name;

  return (
    <Card className="overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow border-rail-blue/20 hover:border-rail-blue/50">
      <div className="relative h-48 w-full bg-muted">
        {item.imageUrl && (
          <img 
            src={item.imageUrl} 
            alt={item.name} 
            className="object-cover w-full h-full"
            loading="lazy"
          />
        )}
        <div className="absolute top-2 right-2 bg-white rounded-md p-1 shadow-sm">
          <div className={`w-4 h-4 border-2 rounded-sm flex items-center justify-center ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}>
            <div className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
          </div>
        </div>
      </div>
      <CardContent className="p-4 flex-grow">
        <h3 className="font-semibold text-lg line-clamp-1">{displayName}</h3>
        <p className="text-sm text-muted-foreground line-clamp-1">{subtitleName}</p>
        <p className="font-bold text-lg mt-2 text-rail-blue-dark">₹{item.price}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        {quantity > 0 ? (
          <div className="flex items-center justify-between w-full border border-rail-blue/30 rounded-lg overflow-hidden">
            <Button 
              variant="ghost" 
              className="rounded-none px-3 text-rail-blue-dark hover:bg-rail-blue/10" 
              onClick={() => updateQuantity(item.id, -1)}
            >
              <Minus size={16} />
            </Button>
            <span className="font-semibold text-lg w-8 text-center">{quantity}</span>
            <Button 
              variant="ghost" 
              className="rounded-none px-3 text-rail-blue-dark hover:bg-rail-blue/10" 
              onClick={() => updateQuantity(item.id, 1)}
            >
              <Plus size={16} />
            </Button>
          </div>
        ) : (
          <Button className="w-full font-bold bg-rail-blue hover:bg-rail-blue-dark text-white" onClick={handleAdd}>
            {t("addToCart")}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
