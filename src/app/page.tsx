"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/store/sessionStore";
import { useI18nStore } from "@/lib/i18n";
import SplashScreen from "@/components/SplashScreen";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const TRAINS = [
  "12345 - Rajdhani Express",
  "15678 - Shatabdi Express",
  "16789 - Intercity Express",
  "18901 - Local Train",
  "20123 - Freight Express",
  "11001 - Pune SF Express",
  "11002 - Howrah Mail",
  "12001 - Bhopal Shatabdi",
  "12124 - Deccan Queen",
  "12201 - Garib Rath",
  "12301 - Howrah Rajdhani",
  "12423 - Dibrugarh Rajdhani",
  "12555 - Gorakhdham Express",
  "12615 - Grand Trunk Express",
  "12703 - Falaknuma Express",
  "12801 - Purushottam Express",
  "12951 - Mumbai Rajdhani",
  "22691 - Bengaluru Rajdhani"
];

const COACHES = ["A1", "A2", "A3", "B1", "B2", "B3", "B4", "B5", "S1", "S2", "S3", "S4"];

export default function Home() {
  const [showSplash, setShowSplash] = useState(false);
  const [train, setTrain] = useState("");
  const [coach, setCoach] = useState("");
  
  // Autocomplete state
  const [showTrains, setShowTrains] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { setSession } = useSessionStore();
  const { t } = useI18nStore();
  const router = useRouter();

  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem("railsafe_splash_shown");
    if (!hasSeenSplash) {
      setShowSplash(true);
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowTrains(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSplashComplete = () => {
    sessionStorage.setItem("railsafe_splash_shown", "true");
    setShowSplash(false);
  };

  const handleStartOrder = () => {
    if (!train || !coach) return;
    setSession(train.split(' - ')[0], coach); // Store just the train number
    router.push("/menu");
  };

  const filteredTrains = TRAINS.filter(t => t.toLowerCase().includes(train.toLowerCase()));

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      
      <div className="min-h-[calc(100vh-140px)] flex flex-col items-center justify-center py-12 px-4 bg-gradient-to-br from-rail-blue/10 to-rail-saffron/10">
        <Card className="w-full max-w-md shadow-2xl border-t-4 border-t-rail-saffron overflow-visible">
          <CardHeader className="space-y-1 bg-white rounded-t-xl pb-6 border-b">
            <CardTitle className="text-2xl text-center font-bold text-rail-blue-dark">{t("appTitle")}</CardTitle>
            <CardDescription className="text-center text-base text-slate-600">
              {t("tagline")}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8 space-y-6 bg-white rounded-b-xl">
            <div className="space-y-2 relative" ref={dropdownRef}>
              <Label htmlFor="trainNumber" className="text-slate-800 font-semibold">{t("trainNumber")}</Label>
              <Input 
                id="trainNumber" 
                value={train} 
                onChange={(e) => {
                  setTrain(e.target.value);
                  setShowTrains(true);
                }}
                onFocus={() => setShowTrains(true)}
                placeholder="Search train by name or number..."
                className="h-12 text-lg focus-visible:ring-rail-blue focus-visible:border-rail-blue bg-white text-slate-900 border-slate-300"
                autoComplete="off"
              />
              {showTrains && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredTrains.length > 0 ? (
                    filteredTrains.map((t) => (
                      <div 
                        key={t} 
                        className="px-4 py-3 hover:bg-rail-blue/10 cursor-pointer text-slate-800 border-b border-slate-100 last:border-0"
                        onClick={() => {
                          setTrain(t);
                          setShowTrains(false);
                        }}
                      >
                        {t}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-slate-500 italic">No trains found</div>
                  )}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="coachNumber" className="text-slate-800 font-semibold">{t("coachNumber")}</Label>
              <Select value={coach} onValueChange={(val) => { if (val) setCoach(val); }}>
                <SelectTrigger id="coachNumber" className="h-12 text-lg focus:ring-rail-blue focus:border-rail-blue bg-white text-slate-900 border-slate-300 shadow-sm relative z-0">
                  <SelectValue placeholder="Select Coach" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200 shadow-xl z-[100]">
                  {COACHES.map(c => (
                    <SelectItem key={c} value={c} className="focus:bg-rail-blue/10 cursor-pointer text-slate-800">
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              size="lg" 
              className="w-full h-14 text-lg font-bold mt-4 shadow-md bg-rail-saffron hover:bg-rail-amber text-white transition-all border-none"
              onClick={handleStartOrder}
              disabled={!train || !coach}
            >
              {t("startOrder")}
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
