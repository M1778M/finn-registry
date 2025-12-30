"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DOCS_CONFIG } from "@/lib/docs-config";
import { ChevronRight } from "lucide-react";
import { DocsSearch } from "@/components/DocsSearch";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-8">
            <DocsSearch />

            <nav className="space-y-6">
              {DOCS_CONFIG.map((section) => (
                <div key={section.title} className="space-y-2">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 px-2 mono-text">
                    {section.title}
                  </h4>
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const href = `/docs/${item.slug}`;
                      const isActive = pathname === href || (item.slug === "introduction" && pathname === "/docs");
                      
                      return (
                        <Link
                          key={item.slug}
                          href={href}
                          className={`flex items-center justify-between group px-2 py-1.5 rounded-md text-sm transition-all ${
                            isActive 
                              ? "bg-primary/10 text-primary font-medium" 
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          <span className="truncate">{item.title}</span>
                          {isActive && <ChevronRight size={14} className="animate-in slide-in-from-left-2 duration-300" />}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            <div className="p-4 rounded-xl border border-dashed border-border bg-muted/20 hidden md:block">
              <p className="text-[10px] text-muted-foreground mono-text mb-2 uppercase tracking-tight">Need help?</p>
              <p className="text-xs text-muted-foreground mb-4 font-medium">
                Can't find what you're looking for? Join our community.
              </p>
              <a 
                href="https://discord.gg" 
                target="_blank" 
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1 group"
              >
                Discord Community <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </aside>

        {/* Content area */}
        <main className="flex-1 min-w-0">
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
