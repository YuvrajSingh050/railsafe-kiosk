"use client";

import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";

export function DemoBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-amber-100 border-l-4 border-amber-500 p-4 mb-6 relative rounded-r shadow-sm">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
        </div>
        <div className="ml-3 pr-8">
          <p className="text-sm text-amber-800 font-medium">
            Demo Mode: Data persists in database. Use &apos;Reset Demo Data&apos; button below for a fresh demo.
          </p>
        </div>
        <button 
          className="absolute right-2 top-2 text-amber-500 hover:bg-amber-200 rounded p-1"
          onClick={() => setVisible(false)}
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
