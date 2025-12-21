"use client";

import { Label } from "@radix-ui/react-label";
import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Switch } from "@radix-ui/react-switch";

export const DevTools = () => {
    const [ isSuccessMode, setIsSuccessMode ] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem("dev_payment_mode");
        if ( saved !== null ) setIsSuccessMode(saved === "success");
    }, []);

    const toggleMode = (checked: boolean) => {
        const mode = checked ? "success" : "fail";
        setIsSuccessMode(checked);
        localStorage.setItem("dev_payment_mode", mode);
    };

    return (
    <Card className="fixed top-4 right-4 z-[9999] p-4 shadow-2xl border-2 border-orange-500 w-64 bg-white/90 backdrop-blur">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="payment-mode" className="font-bold text-orange-700">
            Tryb Portfolio (L402)
          </Label>
        </div>
        <div className="flex items-center space-x-2 border-t pt-2">
          <Switch
            id="payment-mode" 
            checked={isSuccessMode} 
            onCheckedChange={toggleMode} 
          />
          <Label htmlFor="payment-mode">
            {isSuccessMode ? "✅ Płatności przechodzą" : "❌ Symuluj błąd sieci"}
          </Label>
        </div>
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
          Symulator Płatności Lightning
        </p>
      </div>
    </Card>
  );
};