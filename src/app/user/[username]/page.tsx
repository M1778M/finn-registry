"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  Package, 
  Download, 
  Star, 
  MapPin, 
  Link as LinkIcon, 
  Github, 
  Calendar,
  Search,
  ArrowLeft
} from "lucide-react";

export default function UserProfile() {
  const { username } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch(`/api/user/${username}`)
      .then(res => {
        if (!res.ok) throw new Error("User not found");
        return res.json();
      })
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse mono-text">LOADING_USER_DATA...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold mono-text text-red-500">404</h1>
      <p className="text-muted-foreground">{error}</p>
      <Link href="/explore" className="text-primary hover:underline flex items-center gap-2">
        <ArrowLeft size={16} /> Back to Explore
      </Link>
    </div>
  );

  const filteredPackages = data.packages.filter((p: any) => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-20">
      {/* Profile Header */}
      <div className="bg-muted/30 border-b border-border py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <img 
              src={data.user.avatarUrl} 
              alt={data.user.login} 
              className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border-2 border-border shadow-xl"
            />
            <div className="flex-1">
              <h1 className="text-4xl font-bold tracking-tight mb-2">{data.user.name || data.user.login}</h1>
              <p className="text-xl text-muted-foreground mono-text mb-4">@{data.user.login}</p>
              
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {data.user.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} />
                    <span>{data.user.location}</span>
                  </div>
                )}
                {data.user.blog && (
                  <a href={data.user.blog} target="_blank" rel="noopener" className="flex items-center gap-1.5 hover:text-primary transition-colors">
                    <LinkIcon size={14} />
                    <span>{new URL(data.user.blog).hostname}</span>
                  </a>
                )}
                <div className="flex items-center gap-1.5">
                  <Github size={14} />
                  <a href={`https://github.com/${data.user.login}`} target="_blank" rel="noopener" className="hover:text-primary transition-colors">
                    github.com/{data.user.login}
                  </a>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  <span>Joined {new Date(data.user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-8 p-6 bg-background rounded-xl border border-border shadow-sm w-full md:w-auto">
              <div className="text-center">
                <div className="text-2xl font-bold">{data.stats.totalPackages}</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Packages</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{data.stats.totalDownloads}</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Downloads</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{data.stats.totalStars}</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Stars</div>
              </div>
            </div>
          </div>
          
          {data.user.bio && (
            <p className="mt-8 text-lg max-w-3xl text-muted-foreground leading-relaxed">
              {data.user.bio}
            </p>
          )}
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 mt-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <h2 className="text-2xl font-bold mono-text uppercase tracking-tight">Packages</h2>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input 
              type="text" 
              placeholder="Filter user packages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-muted/30 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
            />
          </div>
        </div>

        {filteredPackages.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredPackages.map((pkg: any) => (
              <Link key={pkg.id} href={`/package/${pkg.name}`} className="dev-card group block">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{pkg.name}</h3>
                  <div className="flex items-center gap-3">
                    {pkg.isDeprecated === 1 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 uppercase font-bold">
                        Deprecated
                      </span>
                    )}
                    <span className="text-[10px] px-2 py-0.5 rounded border border-border mono-text bg-muted/50 uppercase tracking-wider">
                      v{pkg.latestVersion || "1.0.0"}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">
                  {pkg.description || "No description provided."}
                </p>
                <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Download size={12} className="text-primary" />
                    <span>{pkg.downloads}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Star size={12} className="text-amber-500" />
                    <span>{pkg.stars || 0}</span>
                  </div>
                  <div className="flex-1" />
                  <span className="text-[10px] text-muted-foreground italic">
                    Updated {new Date(pkg.updatedAt || pkg.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-border rounded-2xl bg-muted/10">
            <Package size={40} className="mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium text-muted-foreground">No packages found</h3>
            <p className="text-sm text-muted-foreground/60">Try searching for something else.</p>
          </div>
        )}
      </div>
    </div>
  );
}
