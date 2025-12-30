"use client";

import { useState, useEffect } from "react";
import { X, Cookie, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function CookieNotification() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Small delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-2xl z-[100] animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="bg-background/80 backdrop-blur-xl border border-primary/20 shadow-[0_0_50px_-12px_rgba(var(--primary-rgb),0.2)] rounded-2xl p-6 md:p-8 relative overflow-hidden group">
        {/* Background Accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 relative z-10">
          <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 shrink-0">
            <Cookie className="text-primary w-6 h-6" />
          </div>
          
          <div className="flex-1 space-y-2">
            <h3 className="font-bold text-lg mono-text flex items-center gap-2 uppercase tracking-tight">
              Cookie Preferences
              <ShieldCheck size={16} className="text-primary" />
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We use cookies to improve your experience, analyze our traffic, and for essential registry functionality. By clicking "Accept", you agree to our use of cookies as described in our{" "}
              <Link href="/privacy" className="text-primary hover:underline underline-offset-4 decoration-primary/30">
                Privacy Policy
              </Link>.
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto pt-2 md:pt-0">
            <button
              onClick={acceptCookies}
              className="flex-1 md:flex-none bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-all active:scale-[0.98] shadow-lg shadow-primary/20"
            >
              Accept All
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="p-2.5 rounded-lg border border-border bg-muted/30 hover:bg-muted text-muted-foreground transition-colors group/close"
              aria-label="Close"
            >
              <X size={18} className="group-hover/close:rotate-90 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
