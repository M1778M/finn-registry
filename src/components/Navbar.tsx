"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Github, Package, Search, User as UserIcon, LogOut, Terminal } from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    fetch("/api/auth/status")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null));
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary text-primary-foreground p-1.5 rounded group-hover:rotate-12 transition-transform">
              <Package size={20} />
            </div>
            <span className="text-xl font-bold tracking-tighter mono-text">
              FINN<span className="text-muted-foreground opacity-50">.REG</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link 
              href="/explore" 
              className={`transition-colors hover:text-primary ${pathname === "/explore" ? "text-primary" : "text-muted-foreground"}`}
            >
              Explore
            </Link>
            <Link 
              href="/docs" 
              className={`transition-colors hover:text-primary ${pathname === "/docs" ? "text-primary" : "text-muted-foreground"}`}
            >
              Documentation
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/explore" className="p-2 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-primary">
            <Search size={20} />
          </Link>

          {mounted && (
            user ? (
              <div className="flex items-center gap-4">
                <Link 
                  href="/dashboard" 
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border hover:bg-muted transition-all text-sm mono-text"
                >
                  <Terminal size={16} />
                  Dashboard
                </Link>
                <div className="h-4 w-px bg-border mx-1" />
                <button onClick={handleLogout} className="text-muted-foreground hover:text-destructive transition-colors">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => {
                  const host = window.location.hostname;
                  let authUrl = "/api/auth/github";
                  
                  if (host.includes("daytona.works") || host.includes("orchids.page")) {
                    const workspaceId = host.split(".")[0];
                    const id = workspaceId.startsWith("3000-") ? workspaceId : `3000-${workspaceId}`;
                    authUrl = `https://${id}.orchids.page/api/auth/github`;
                  } else {
                    authUrl = window.location.origin + "/api/auth/github";
                  }

                  if (window.self !== window.top) {
                    window.parent.postMessage({ type: "OPEN_EXTERNAL_URL", data: { url: authUrl } }, "*");
                  } else {
                    window.location.href = authUrl;
                  }
                }}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <Github size={18} />
                Login with GitHub
              </button>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
