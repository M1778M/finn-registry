"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Package, Download, Filter, ArrowRight, Star, Clock, ChevronRight } from "lucide-react";

function ExploreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "All Packages";
  const sort = searchParams.get("sort") || "downloads";

  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(query);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (category && category !== "All Packages") params.set("category", category);
    if (sort) params.set("sort", sort);

    fetch(`/api/packages?${params.toString()}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Server returned ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setPackages(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Explore Fetch Error:", err);
        setPackages([]);
        setLoading(false);
      });
  }, [query, category, sort]);

  // Search suggestions logic
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(() => {
      fetch(`/api/search/suggestions?q=${searchQuery}`)
        .then(res => res.json())
        .then(data => setSuggestions(data))
        .catch(() => setSuggestions([]));
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ q: searchQuery });
    setShowSuggestions(false);
  };

  const updateFilters = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    router.push(`/explore?${params.toString()}`);
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-8">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 mono-text">Categories</h3>
            <div className="space-y-1">
              {["All Packages", "Standard Library", "Web Frameworks", "Database Drivers", "CLI Tools", "Utilities"].map((cat) => (
                <button 
                  key={cat} 
                  onClick={() => updateFilters({ category: cat })}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors text-left group"
                >
                  <span className={cat === category ? "text-primary font-bold" : "text-muted-foreground"}>{cat}</span>
                  <ChevronRight size={14} className={cat === category ? "text-primary" : "opacity-0 group-hover:opacity-100 transition-opacity"} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 mono-text">Sort By</h3>
            <div className="space-y-1">
              {[
                { label: "Most Downloads", icon: Download, value: "downloads" },
                { label: "Recently Updated", icon: Clock, value: "recent" },
                { label: "Most Starred", icon: Star, value: "stars" },
              ].map((s) => (
                <button 
                  key={s.value} 
                  onClick={() => updateFilters({ sort: s.value })}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors ${sort === s.value ? "text-primary font-bold bg-muted" : "text-muted-foreground"}`}
                >
                  <s.icon size={14} />
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="mb-8 relative">
            <form onSubmit={handleSearch} className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search Finn packages..." 
                className="w-full h-12 pl-12 pr-4 rounded-lg border border-border bg-muted/30 focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none mono-text"
              />
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setSearchQuery(suggestion);
                      updateFilters({ q: suggestion });
                      setShowSuggestions(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted text-sm text-left transition-colors"
                  >
                    <Search size={14} className="text-muted-foreground" />
                    <span>{suggestion}</span>
                  </button>
                ))}
              </div>
            )}
            {/* Click away to close suggestions */}
            {showSuggestions && (
              <div className="fixed inset-0 z-40" onClick={() => setShowSuggestions(false)} />
            )}
          </div>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold mono-text uppercase tracking-widest">
              {loading ? "Searching..." : `${packages.length} Results Found`}
            </h2>
          </div>

          <div className="space-y-4">
            {loading ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="dev-card animate-pulse">
                  <div className="h-6 w-1/4 bg-muted rounded mb-2" />
                  <div className="h-4 w-full bg-muted rounded" />
                </div>
              ))
            ) : packages.length > 0 ? (
              packages.map((pkg) => (
                <Link key={pkg.id} href={`/package/${pkg.name}`} className="dev-card block group hover:border-primary/50 relative overflow-hidden">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{pkg.name}</h3>
                        <span className="text-[10px] px-2 py-0.5 rounded border border-border mono-text bg-muted/50">
                          v{pkg.latestVersion || "1.0.0"}
                        </span>
                        {pkg.category === "Standard Library" && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-bold uppercase tracking-wider">
                            Official
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {pkg.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-6 text-sm mono-text text-muted-foreground">
                      <div className="flex items-center gap-1.5" title="Downloads">
                        <Download size={16} />
                        <span>{pkg.downloads}</span>
                      </div>
                      <div className="flex items-center gap-1.5" title="Stars">
                        <Star size={16} className={pkg.stars > 0 ? "text-amber-500 fill-amber-500" : ""} />
                        <span>{pkg.stars || 0}</span>
                      </div>
                      <ArrowRight size={18} className="text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="dev-card text-center py-20">
                <Package size={48} className="mx-auto text-muted-foreground mb-4 opacity-20" />
                <h3 className="text-xl font-bold mb-2">No packages found</h3>
                <p className="text-muted-foreground">Try adjusting your search query or filters.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto max-w-6xl px-4 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <ExploreContent />
    </Suspense>
  );
}
