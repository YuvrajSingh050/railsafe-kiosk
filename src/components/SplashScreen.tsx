"use client";

import { useCallback, useEffect, useState } from "react";
import { Train } from "lucide-react";

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [visible, setVisible] = useState(true);

  const handleComplete = useCallback(() => {
    setVisible(false);
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [handleComplete]);

  if (!visible) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-b from-primary to-secondary cursor-pointer transition-opacity duration-500"
      onClick={handleComplete}
    >
      <div className="animate-bounce rounded-full bg-white p-6 shadow-2xl">
        <Train size={80} className="text-primary" />
      </div>
      <h1 className="mt-8 text-5xl font-bold text-white tracking-wider">
        RailSafe
      </h1>
      <p className="mt-4 text-xl text-white/90">
        Know Your Bill Before You Pay
      </p>
    </div>
  );
}
