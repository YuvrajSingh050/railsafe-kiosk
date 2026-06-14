"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/store/sessionStore";
import { useI18nStore } from "@/lib/i18n";
import { MenuCard } from "@/components/menu/MenuCard";
import { CategoryTabs } from "@/components/menu/CategoryTabs";
import { CartBar } from "@/components/menu/CartBar";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";

type MenuItem = {
  id: string;
  itemCode: string;
  name: string;
  nameHindi: string | null;
  category: string;
  price: number;
  isVeg: boolean;
  imageUrl: string | null;
};

export default function MenuPage() {
  const router = useRouter();
  const { trainNumber, coachNumber } = useSessionStore();
  const { t } = useI18nStore();
  
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = ["All", "Breakfast", "Lunch", "Dinner", "Snacks", "Beverages"];

  useEffect(() => {
    if (!trainNumber || !coachNumber) {
      router.replace("/");
      return;
    }

    const fetchMenu = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/menu");
        if (res.ok) {
          const data = await res.json();
          setItems(data);
        }
      } catch (error) {
        console.error("Failed to fetch menu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [trainNumber, coachNumber, router]);

  const filteredItems = items.filter(item => {
    const matchesCategory = category === "All" || item.category === category;
    const searchLower = search.toLowerCase();
    const matchesSearch = item.name.toLowerCase().includes(searchLower) || 
                          (item.nameHindi && item.nameHindi.includes(searchLower));
    return matchesCategory && matchesSearch;
  });

  if (!trainNumber || !coachNumber) return null;

  return (
    <div className="container mx-auto px-4 py-6 pb-32">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold tracking-tight text-primary">
            {t("appTitle")} Menu
          </h2>
          <div className="flex items-center gap-2 text-muted-foreground font-medium">
            <span className="bg-muted px-2 py-1 rounded text-sm">{t("trainNumber")}: {trainNumber}</span>
            <span className="bg-muted px-2 py-1 rounded text-sm">{t("coachNumber")}: {coachNumber}</span>
          </div>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <Input 
            type="text" 
            placeholder={t("searchMenu")} 
            className="pl-10 h-12 text-base"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <CategoryTabs 
          categories={categories} 
          activeCategory={category} 
          onChange={setCategory} 
        />

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-primary" size={40} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
            {filteredItems.map(item => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {!loading && filteredItems.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-lg">
            No items found.
          </div>
        )}
      </div>

      <CartBar />
    </div>
  );
}
