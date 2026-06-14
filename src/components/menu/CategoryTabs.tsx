import { useI18nStore } from "@/lib/i18n";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  onChange: (category: string) => void;
}

export function CategoryTabs({ categories, activeCategory, onChange }: CategoryTabsProps) {
  const { t, language } = useI18nStore();

  return (
    <Tabs value={activeCategory} onValueChange={onChange} className="w-full">
      <div className="overflow-x-auto pb-2 scrollbar-hide">
        <TabsList className="inline-flex h-12 items-center justify-start rounded-lg bg-rail-blue/5 p-1 border border-rail-blue/10">
          {categories.map((category) => (
            <TabsTrigger 
              key={category} 
              value={category}
              className="rounded-md px-6 py-2.5 text-sm font-bold text-slate-600 transition-all data-[state=active]:bg-rail-blue data-[state=active]:text-white data-[state=active]:shadow-md min-w-fit"
            >
              {language === 'hi' && category !== 'All' ? t(category.toLowerCase() as keyof typeof t) : category === 'All' ? t("all") : category}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
    </Tabs>
  );
}
