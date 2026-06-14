"use client";

import Link from "next/link";
import { Train, Globe } from "lucide-react";
import { useI18nStore } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { language, setLanguage, t } = useI18nStore();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "hi" : "en");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-primary text-primary-foreground shadow-md no-print">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="rounded-full bg-white p-1 text-primary">
            <Train size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold leading-none tracking-tight">
              {t("appTitle")}
            </h1>
            <p className="text-xs text-primary-foreground/80">
              {t("tagline")}
            </p>
          </div>
        </Link>
        
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleLanguage}
            className="flex items-center gap-2 hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            <Globe size={16} />
            <span className="font-medium">{language === "en" ? "हिन्दी" : "English"}</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
