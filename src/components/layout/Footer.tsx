"use client";

import { Phone, ShieldAlert } from "lucide-react";
import { useI18nStore } from "@/lib/i18n";
import Link from "next/link";

export default function Footer() {
  const { t } = useI18nStore();

  return (
    <footer className="mt-auto border-t bg-muted py-6 no-print">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 sm:flex-row">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Phone size={18} />
          <span className="font-medium">{t("helpline")}</span>
        </div>
        
        <Link 
          href="/complaint" 
          className="flex items-center gap-2 text-destructive hover:underline font-medium"
        >
          <ShieldAlert size={18} />
          <span>{t("reportOvercharging")}</span>
        </Link>
      </div>
    </footer>
  );
}
