"use client";

import { useState, useEffect } from "react";
import { Check, Copy, Info, Lightbulb, AlertTriangle, Zap } from "lucide-react";
import { codeToHtml } from "shiki";

export function CodeBlock({ code, language }: { code: string; language: string }) {
  const [html, setHtml] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    codeToHtml(code, {
      lang: language || "text",
      theme: "vitesse-dark",
    }).then(setHtml);
  }, [code, language]);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-6">
      <div className="absolute right-3 top-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={copy}
          className="p-1.5 rounded-md border border-border bg-muted/80 hover:bg-muted text-muted-foreground transition-colors"
        >
          {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
        </button>
      </div>
      <div 
        className="rounded-xl border border-border overflow-hidden [&>pre]:!bg-muted/50 [&>pre]:!p-4 [&>pre]:!m-0 prose-pre:!bg-transparent"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

export function Callout({ children, type = "info" }: { children: React.ReactNode; type?: string }) {
  const icons: Record<string, any> = {
    info: <Info size={18} />,
    tip: <Lightbulb size={18} />,
    warning: <AlertTriangle size={18} />,
    important: <Zap size={18} />,
  };

  const styles: Record<string, string> = {
    info: "bg-blue-500/5 border-l-blue-500 text-blue-400",
    tip: "bg-emerald-500/5 border-l-emerald-500 text-emerald-400",
    warning: "bg-amber-500/5 border-l-amber-500 text-amber-400",
    important: "bg-rose-500/5 border-l-rose-500 text-rose-400",
  };

  return (
    <div className={`flex gap-3 p-4 rounded-r-lg border-l-4 ${styles[type]} my-6 items-start`}>
      <div className="mt-0.5 shrink-0 opacity-80">{icons[type]}</div>
      <div className="text-sm leading-relaxed prose-p:!m-0 text-foreground/90 w-full">
        {children}
      </div>
    </div>
  );
}
