"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Github, Twitter, MessageSquare, ExternalLink, Terminal, Shield, Zap, Globe, Heart } from "lucide-react";

export default function Footer() {
  const [mounted, setMounted] = useState(false);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    setMounted(true);
  }, []);

  const footerSections = [
    {
      title: "Product",
      links: [
        { label: "Registry", href: "/explore" },
        { label: "CLI Tool", href: "/docs/installation" },
        { label: "Security", href: "/docs/security/overview" },
        { label: "Dashboard", href: "/dashboard" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Documentation", href: "/docs" },
        { label: "Guides", href: "/docs/guides/setup" },
        { label: "API Reference", href: "/docs/api/overview" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
      ],
    },
    {
      title: "Community",
      links: [
        { label: "GitHub", href: "https://github.com", icon: Github },
        { label: "Discord", href: "https://discord.com", icon: MessageSquare },
        { label: "Twitter", href: "https://twitter.com", icon: Twitter },
      ],
    },
  ];

  return (
    <footer className="relative border-t border-border bg-background pt-24 pb-12 overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: 'radial-gradient(var(--primary) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                <Terminal size={24} className="text-primary" />
              </div>
              <span className="text-2xl font-bold tracking-tighter mono-text uppercase">Finn Registry</span>
            </Link>
            <p className="text-muted-foreground mb-8 max-w-sm leading-relaxed">
              The mission-critical package registry for the Finn programming language. Built for absolute speed, security, and developer joy.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-medium text-emerald-500 uppercase tracking-wider mono-text">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                All Systems Operational
              </div>
            </div>
          </div>

          {/* Links Columns */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-bold uppercase tracking-widest mono-text mb-6 text-foreground/80">
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link 
                      href={link.href} 
                      className="text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors text-sm group"
                    >
                      {"icon" in link && link.icon && <link.icon size={14} className="group-hover:scale-110 transition-transform" />}
                      {link.label}
                      {!link.href.startsWith("/") && <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 -translate-y-1 translate-x-1 transition-all" />}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6 text-xs text-muted-foreground mono-text">
            <span>© {mounted ? currentYear : "---"} Finn Foundation</span>
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground mono-text">
            <span>Crafted with</span>
            <Heart size={12} className="text-red-500 animate-bounce" />
            <span>by the Finn Core Team</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {[Zap, Shield, Globe].map((Icon, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-muted-foreground hover:text-primary hover:z-20 transition-all cursor-help" title={["Fast", "Secure", "Global"][i]}>
                  <Icon size={14} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
