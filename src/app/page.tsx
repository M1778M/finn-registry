"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Terminal, Package, Download, Zap, Shield, Globe } from "lucide-react";

export default function Home() {
  const [stats, setStats] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    
    // Check auth status
    fetch("/api/auth/status")
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setUser(data.user);
        }
      })
      .catch(console.error)
      .finally(() => setCheckingAuth(false));

    fetch("/api/stats")
      .then((res) => {
        if (!res.ok) throw new Error("Stats not available");
        return res.json();
      })
      .then((data) => {
        setStats(data);
      })
      .catch(err => {
        console.error("Stats Error:", err);
        setStats({ totalPackages: 0, totalDownloads: 0, trendingPackages: [], topDownloadedPackages: [], recentPackages: [] });
      });
  }, []);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(() => {
      fetch(`/api/search/suggestions?q=${encodeURIComponent(searchQuery)}`)
        .then(res => res.ok ? res.json() : [])
        .then(data => setSuggestions(data))
        .catch(() => setSuggestions([]));
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogin = () => {
    const authUrl = "/api/auth/github";
    if (window.self !== window.top) {
      window.parent.postMessage({ type: "OPEN_EXTERNAL_URL", data: { url: window.location.origin + authUrl } }, "*");
    } else {
      window.location.href = authUrl;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden border-b border-border bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted/50 text-xs mono-text mb-8">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            Registry v1.0.0-alpha is now live
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-primary to-primary/60">
            FINN PACKAGE REGISTRY
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            The high-performance, secure, and distributed package manager for the Finn programming language. Built for speed and scale.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-3xl mx-auto w-full relative">
            <div className="relative w-full group">
              <form onSubmit={handleSearch} className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Search packages (e.g. 'http', 'json', 'auth')..." 
                  className="w-full h-14 pl-12 pr-4 rounded-xl border border-border bg-muted/30 focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none text-lg mono-text"
                />
              </form>
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-xl shadow-2xl z-50 overflow-hidden">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => {
                        setSearchQuery(suggestion);
                        router.push(`/explore?q=${encodeURIComponent(suggestion)}`);
                        setShowSuggestions(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-4 hover:bg-muted text-left transition-colors border-b border-border/50 last:border-0"
                    >
                      <Search size={16} className="text-muted-foreground" />
                      <span className="mono-text">{suggestion}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm mono-text text-muted-foreground">
            <div className="flex items-center gap-2">
              <Package size={16} className="text-primary" />
              <span>{stats?.totalPackages || 0} Packages</span>
            </div>
            <div className="flex items-center gap-2">
              <Download size={16} className="text-primary" />
              <span>{stats?.totalDownloads || 0} Downloads</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe size={16} className="text-primary" />
              <span>Edge Distributed</span>
            </div>
          </div>
        </div>
      </section>

      {/* CLI Section */}
      <section className="py-20 px-4 bg-muted/10">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-4 mono-text uppercase">Get Started</h2>
              <p className="text-muted-foreground mb-6">
                Installing Finn packages is as simple as running a single command. The Finn CLI handles dependency resolution and versioning automatically.
              </p>
              <ul className="space-y-4">
                {[
                  { icon: Zap, text: "Zero-config installation" },
                  { icon: Shield, text: "Cryptographically verified packages" },
                  { icon: Terminal, text: "Full CLI integration" }
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                      <item.icon size={16} />
                    </div>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-black border border-border shadow-2xl rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/10">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <div className="text-[10px] text-muted-foreground mono-text ml-2 uppercase tracking-widest">Terminal</div>
              </div>
              <div className="p-6 font-mono text-sm leading-relaxed">
                <div className="text-muted-foreground mb-2"># Install the registry CLI</div>
                <div className="flex gap-2 mb-4">
                  <span className="text-primary">$</span>
                  <span className="text-zinc-100">curl -fsSL finn.sh/install | sh</span>
                </div>
                <div className="text-muted-foreground mb-2"># Add a package to your project</div>
                <div className="flex gap-2">
                  <span className="text-primary">$</span>
                  <span className="text-zinc-100">finn add http</span>
                </div>
                <div className="mt-4 text-green-400">✔ Successfully added http@1.2.4</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col gap-16">
            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Zap size={20} />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight mono-text uppercase">Trending</h2>
                </div>
                <Link href="/explore?sort=stars" className="text-sm text-primary hover:underline mono-text">View all →</Link>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats?.trendingPackages?.length > 0 ? (
                  stats.trendingPackages.map((pkg: any) => (
                    <PackageCard key={pkg.id} pkg={pkg} mounted={mounted} />
                  ))
                ) : (
                  [1, 2, 3].map((i) => <SkeletonCard key={i} />)
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Download size={20} />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight mono-text uppercase">Top Downloaded</h2>
                </div>
                <Link href="/explore?sort=downloads" className="text-sm text-primary hover:underline mono-text">View all →</Link>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats?.topDownloadedPackages?.length > 0 ? (
                  stats.topDownloadedPackages.map((pkg: any) => (
                    <PackageCard key={pkg.id} pkg={pkg} mounted={mounted} />
                  ))
                ) : (
                  [1, 2, 3].map((i) => <SkeletonCard key={i} />)
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 border-t border-border">
        <div className="container mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4 mono-text uppercase">Built by Developers</h2>
          <p className="text-muted-foreground mb-10 max-w-xl mx-auto">
            Join the community and help build the future of Finn. Publish your first package today or explore the documentation.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/docs" className="flex items-center gap-2 bg-muted hover:bg-muted/80 px-6 py-3 rounded-xl transition-all border border-border text-sm font-medium">
              <Globe size={18} />
              Read the Specs
            </Link>
            {!checkingAuth && (
              user ? (
                <Link 
                  href="/dashboard"
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl transition-all hover:opacity-90 text-sm font-medium shadow-lg shadow-primary/20"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <button 
                  onClick={handleLogin}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl transition-all hover:opacity-90 text-sm font-medium shadow-lg shadow-primary/20"
                >
                  Publish a Package
                </button>
              )
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="p-6 rounded-xl border border-border bg-muted/20 animate-pulse">
      <div className="h-6 w-1/2 bg-muted rounded mb-4" />
      <div className="h-4 w-full bg-muted rounded mb-2" />
      <div className="h-4 w-3/4 bg-muted rounded" />
    </div>
  );
}

function PackageCard({ pkg, mounted }: { pkg: any, mounted: boolean }) {
  return (
    <Link href={`/package/${pkg.name}`} className="p-6 rounded-xl border border-border bg-background hover:border-primary/50 hover:shadow-xl transition-all group block">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-lg truncate group-hover:text-primary transition-colors">{pkg.name}</h3>
        <span className="text-[10px] px-2 py-0.5 rounded border border-border mono-text bg-muted/50">
          v{pkg.latestVersion || "1.0.0"}
        </span>
      </div>
      <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">
        {pkg.description}
      </p>
      <div className="flex items-center justify-between pt-4 border-t border-border/50">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Download size={12} />
          <span>{pkg.downloads}</span>
        </div>
        <span className="text-[10px] text-muted-foreground italic">
          {mounted && pkg.createdAt ? new Date(pkg.createdAt).toLocaleDateString() : "Recently"}
        </span>
      </div>
    </Link>
  );
}
