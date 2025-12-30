"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  User, 
  Package, 
  Key, 
  Plus, 
  ExternalLink, 
  Copy, 
  Check, 
  Terminal, 
  Settings,
  ArrowUpRight,
  ShieldCheck,
  BarChart3,
  Github,
  History,
  Mail,
  MapPin,
  Link as LinkIcon,
  Globe,
  Download,
  Star,
  GitFork
} from "lucide-react";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [newApiKey, setNewApiKey] = useState<string | null>(null);
  const [tokenName, setTokenName] = useState("");
  const [tokenNameError, setTokenNameError] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: "success" | "error", message: string } | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/dashboard/data");
      
      if (res.status === 401) {
        const host = window.location.hostname;
        let authUrl = "/api/auth/github";
        
        if (host.includes("orchids.page") || host.includes("daytona.works")) {
          authUrl = window.location.origin + "/api/auth/github";
        }

        if (window.self !== window.top) {
          window.parent.postMessage({ type: "OPEN_EXTERNAL_URL", data: { url: authUrl } }, "*");
        } else {
          window.location.href = authUrl;
        }
        return;
      }

      if (!res.ok) {
        const result = await res.json().catch(() => ({ error: `Server Error (${res.status})` }));
        setData(result);
        setLoading(false);
        return;
      }

      const result = await res.json();
      setData(result);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setData({ error: "Failed to connect to the server. Please check your connection." });
      setLoading(false);
    }
  };

  const generateNewKey = async (description?: string) => {
    if (!tokenName.trim()) {
      setTokenNameError(true);
      return;
    }
    
    setTokenNameError(false);
    setIsGenerating(true);
    
    try {
      const res = await fetch("/api/me/api-key", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: tokenName, description })
      });
      const result = await res.json();
      
      if (result.apiKey) {
        setNewApiKey(result.apiKey);
        setTokenName("");
        // Update local state immediately with the record from server
        if (result.keyRecord) {
          setData((prev: any) => {
            if (!prev) return prev;
            // Avoid duplicates if fetchDashboardData already ran
            const exists = prev.apiKeys?.some((k: any) => k.id === result.keyRecord.id);
            if (exists) return prev;
            return {
              ...prev,
              apiKeys: [result.keyRecord, ...(prev.apiKeys || [])]
            };
          });
        }
        await fetchDashboardData();
      } else {
        console.error(result.error || "Failed to generate key");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const revokeKey = async (id: string) => {
    try {
      const res = await fetch(`/api/me/api-key/${id}`, { method: "DELETE" });
      if (res.ok) {
        setRevokingId(null);
        // Update local state immediately
        setData((prev: any) => {
          if (!prev) return prev;
          return {
            ...prev,
            apiKeys: prev.apiKeys.filter((k: any) => k.id !== id)
          };
        });
        await fetchDashboardData();
      } else {
        const result = await res.json();
        console.error(result.error || "Failed to revoke key");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const saveSettings = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSavingSettings(true);
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      await fetch("/api/me/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      await fetchDashboardData();
      setSaveStatus({ type: "success", message: "Settings saved successfully!" });
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      console.error(err);
      setSaveStatus({ type: "error", message: "Failed to save settings." });
      setTimeout(() => setSaveStatus(null), 3000);
    } finally {
      setSavingSettings(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-20 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

    if (data?.error) {
      return (
        <div className="container mx-auto max-w-6xl px-4 py-20 text-center">
          <div className="dev-card border-red-500/50 bg-red-500/5 max-w-md mx-auto p-8">
            <ShieldCheck className="mx-auto text-red-500 mb-4" size={48} />
            <h2 className="text-2xl font-bold mb-2">Dashboard Error</h2>
            <p className="text-muted-foreground mb-6 text-sm">{data.error}</p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => window.location.reload()}
                className="bg-primary text-primary-foreground px-6 py-2 rounded-xl font-bold text-sm"
              >
                Retry Connection
              </button>
              <Link href="/" className="text-xs text-muted-foreground hover:underline">
                Return to Home Page
              </Link>
            </div>
          </div>
        </div>
      );
    }

  const { user, packages, logins, githubAnalytics } = data;

  if (!user) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">User Not Found</h2>
        <p className="text-muted-foreground mb-8">We couldn't retrieve your user profile. Please try logging in again.</p>
        <Link href="/" className="bg-primary text-primary-foreground px-6 py-2 rounded-xl">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
        <div className="flex items-center gap-6">
          <div className="relative">
            <img src={user.avatarUrl} alt={user.login} className="w-24 h-24 rounded-2xl border-4 border-background shadow-2xl relative z-10" />
            <div className="absolute -inset-1 bg-gradient-to-tr from-primary to-primary/20 rounded-2xl blur opacity-30 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-3xl font-bold tracking-tight">{user.name || user.login}</h1>
              {user.isVerified && <ShieldCheck className="text-primary" size={20} />}
            </div>
            <p className="text-muted-foreground flex items-center gap-2">
              <Github size={14} />
              <span className="mono-text text-sm">@{user.login}</span>
              <span className="text-border mx-1">|</span>
              <span className="text-xs">Member since {new Date(user.createdAt).getFullYear()}</span>
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <Link href="/explore" className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all">
            <Plus size={18} />
            Publish Package
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border mb-8 overflow-x-auto pb-px">
        {[
          { id: "overview", label: "Overview", icon: BarChart3 },
          { id: "packages", label: "Packages", icon: Package },
          { id: "security", label: "Security & Logins", icon: ShieldCheck },
          { id: "settings", label: "Profile Settings", icon: Settings },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all relative whitespace-nowrap ${
              activeTab === tab.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === "overview" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* GitHub Analytics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Stars", value: githubAnalytics.totalStars, icon: Star, color: "text-amber-500" },
                { label: "Total Forks", value: githubAnalytics.totalForks, icon: GitFork, color: "text-blue-500" },
                { label: "Contributions", value: githubAnalytics.contributions, icon: Github, color: "text-green-500" },
                { label: "Registry Downloads", value: packages.reduce((acc: any, p: any) => acc + (p.downloads || 0), 0), icon: Download, color: "text-primary" },
              ].map((stat, i) => (
                <div key={i} className="dev-card p-6 flex flex-col items-center text-center">
                  <stat.icon size={24} className={`${stat.color} mb-3`} />
                  <div className="text-2xl font-bold mono-text mb-1">{stat.value.toLocaleString()}</div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Top Languages */}
                <div className="dev-card">
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-6 mono-text flex items-center gap-2">
                    <Terminal size={16} /> Language Distribution
                  </h3>
                  <div className="space-y-4">
                    {githubAnalytics.topLanguages.map((lang: any) => (
                      <div key={lang.name} className="space-y-2">
                        <div className="flex justify-between text-xs font-medium">
                          <span>{lang.name}</span>
                          <span className="text-muted-foreground">{lang.percentage}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all duration-1000 delay-300" 
                            style={{ width: `${lang.percentage}%` }} 
                          />
                        </div>
                      </div>
                    ))}
                    {githubAnalytics.topLanguages.length === 0 && (
                      <p className="text-xs text-muted-foreground text-center py-4">No language data found.</p>
                    )}
                  </div>
                </div>

              {/* Bio / Info */}
              <div className="dev-card">
                <h3 className="text-sm font-bold uppercase tracking-widest mb-6 mono-text flex items-center gap-2">
                  <User size={16} /> Developer Profile
                </h3>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed italic">
                    {user.bio || "No bio provided yet. Add one in settings!"}
                  </p>
                  <div className="grid grid-cols-1 gap-3 pt-4 border-t border-border">
                    {user.email && (
                      <div className="flex items-center gap-3 text-sm">
                        <Mail size={14} className="text-primary" />
                        <span>{user.email}</span>
                      </div>
                    )}
                    {user.location && (
                      <div className="flex items-center gap-3 text-sm">
                        <MapPin size={14} className="text-primary" />
                        <span>{user.location}</span>
                      </div>
                    )}
                    {user.blog && (
                      <div className="flex items-center gap-3 text-sm">
                        <Globe size={14} className="text-primary" />
                        <a href={user.blog} target="_blank" className="hover:text-primary transition-colors truncate">{user.blog}</a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "packages" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {packages.length > 0 ? (
              packages.map((pkg: any) => (
                <div key={pkg.id} className="dev-card group p-0 overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="flex-1 p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{pkg.name}</h3>
                        <span className="text-[10px] px-2 py-0.5 rounded border border-border mono-text bg-muted/50">
                          {pkg.isVerified ? "VERIFIED" : "PUBLIC"}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-6 max-w-2xl">
                        {pkg.description || "No description provided."}
                      </p>
                      <div className="flex flex-wrap gap-6 text-xs mono-text text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Download size={14} className="text-primary" />
                          <span>{pkg.downloads} downloads</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star size={14} className="text-amber-500" />
                          <span>{pkg.stars} stars</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <History size={14} />
                          <span>Updated {new Date(pkg.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    {/* Tiny Analytics Preview */}
                    <div className="bg-muted/30 border-l border-border p-6 flex items-center justify-center min-w-[200px]">
                      <div className="flex items-end gap-1 h-12">
                        {[4, 7, 3, 9, 5, 8, 10].map((h, i) => (
                          <div 
                            key={i} 
                            className="w-2 bg-primary/40 rounded-t-sm group-hover:bg-primary transition-all duration-500" 
                            style={{ height: `${h * 10}%` }}
                          />
                        ))}
                      </div>
                      <div className="ml-4 text-center">
                        <div className="text-xs font-bold mono-text uppercase text-muted-foreground">Trending</div>
                        <div className="text-green-500 text-xs font-bold">+12%</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="dev-card text-center py-24 border-dashed">
                <Package size={48} className="mx-auto text-muted-foreground mb-4 opacity-20" />
                <h3 className="text-xl font-bold mb-2">Namespace Empty</h3>
                <p className="text-muted-foreground mb-8">Start your journey by publishing your first Finn package.</p>
                <Link href="/docs/guides/publishing" className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/20">
                  Read Deployment Guide
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === "security" && (
          <div className="grid md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* API Keys */}
            <div className="space-y-6">
              <div className="dev-card bg-primary/5 border-primary/20">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2 text-primary">
                    <Key size={20} />
                    <h3 className="font-bold uppercase tracking-widest text-xs mono-text">API Credentials</h3>
                  </div>
                </div>
                
                {newApiKey ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-600 text-xs leading-relaxed">
                      <strong>WARNING:</strong> Copy this key now. For your security, we won't show it again.
                    </div>
                    <div className="relative group">
                      <input 
                        readOnly 
                        value={newApiKey}
                        className="w-full bg-black border border-border rounded-xl px-4 py-3 text-sm font-mono text-primary pr-12"
                      />
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(newApiKey);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-muted rounded-lg transition-all"
                      >
                        {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                      </button>
                    </div>
                    <button onClick={() => setNewApiKey(null)} className="w-full py-2 text-xs text-muted-foreground hover:text-primary transition-colors">Done</button>
                  </div>
                  ) : (
                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Generate an API key to authenticate your CLI for automated publishing and CI/CD pipelines.
                        </p>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className={`text-[10px] font-bold uppercase tracking-widest mono-text transition-colors ${tokenNameError ? "text-red-500" : "text-muted-foreground"}`}>
                              {tokenNameError ? "Token Name is Required" : "Token Name"}
                            </label>
                            <input 
                              type="text"
                              placeholder="e.g. GitHub Actions, Laptop..."
                              value={tokenName}
                              onChange={(e) => {
                                setTokenName(e.target.value);
                                if (tokenNameError) setTokenNameError(false);
                              }}
                              className={`w-full bg-muted/30 border rounded-xl px-4 py-2 text-sm outline-none transition-all ${tokenNameError ? "border-red-500/50 focus:border-red-500" : "border-border focus:border-primary"}`}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest mono-text text-muted-foreground">
                              Description (Optional)
                            </label>
                            <input 
                              type="text"
                              placeholder="What is this token for?"
                              id="tokenDescription"
                              className="w-full bg-muted/30 border border-border rounded-xl px-4 py-2 text-sm outline-none focus:border-primary transition-all"
                            />
                          </div>
                          <button 
                            onClick={() => {
                              const descInput = document.getElementById("tokenDescription") as HTMLInputElement;
                              generateNewKey(descInput?.value);
                            }}
                            disabled={isGenerating}
                            className="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-primary/50 text-primary hover:bg-primary/10 transition-all font-bold text-sm disabled:opacity-50"
                          >
                            {isGenerating ? (
                              <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                            ) : (
                              <Plus size={16} />
                            )}
                            Generate New Key
                          </button>
                        </div>
                      </div>
                  )}
                </div>

                <div className="dev-card">
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-6 mono-text flex items-center gap-2">
                      <ShieldCheck size={16} /> Active Tokens
                    </h3>
                    <div className="space-y-3">
                      {data.apiKeys && data.apiKeys.length > 0 ? (
                        data.apiKeys.map((key: any) => (
                          <div key={key.id} className="flex flex-col gap-3 p-3 rounded-lg bg-muted/30 border border-border">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                <div>
                                  <div className="text-xs font-bold mono-text">{key.name}</div>
                                  <div className="text-[10px] text-muted-foreground">
                                    Created {new Date(key.createdAt).toLocaleDateString()}
                                    {key.lastUsedAt && ` • Last used ${new Date(key.lastUsedAt).toLocaleDateString()}`}
                                  </div>
                                </div>
                              </div>
                              {revokingId !== key.id ? (
                                <button 
                                  onClick={() => setRevokingId(key.id)}
                                  className="text-[10px] text-red-500 font-bold hover:underline"
                                >
                                  REVOKE
                                </button>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <button 
                                    onClick={() => revokeKey(key.id)}
                                    className="text-[10px] text-red-500 font-bold hover:underline"
                                  >
                                    CONFIRM
                                  </button>
                                  <span className="text-border">|</span>
                                  <button 
                                    onClick={() => setRevokingId(null)}
                                    className="text-[10px] text-muted-foreground hover:underline"
                                  >
                                    CANCEL
                                  </button>
                                </div>
                              )}
                            </div>
                            {revokingId === key.id && (
                              <div className="text-[10px] text-amber-500 font-medium leading-tight">
                                This will immediately invalidate the token and break any workflows using it.
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-muted-foreground text-center py-4">No active API keys found.</p>
                      )}
                    </div>
                  </div>
            </div>

            {/* Login History */}
            <div className="dev-card">
              <h3 className="text-sm font-bold uppercase tracking-widest mb-6 mono-text flex items-center gap-2">
                <History size={16} /> Auth Session History
              </h3>
              <div className="space-y-4">
                {logins && logins.length > 0 ? (
                  logins.map((login: any) => (
                    <div key={login.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors border border-transparent hover:border-border">
                      <div className="p-2 bg-muted rounded-lg">
                        <Globe size={16} className="text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold mono-text">{login.ipAddress || "127.0.0.1"}</span>
                          <span className="text-[10px] text-muted-foreground">{new Date(login.createdAt).toLocaleString()}</span>
                        </div>
                        <div className="text-[10px] text-muted-foreground truncate">{login.userAgent}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <History size={32} className="mx-auto text-muted-foreground mb-3 opacity-20" />
                    <p className="text-xs text-muted-foreground">No login history available yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="dev-card">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-sm font-bold uppercase tracking-widest mono-text">Public Profile Settings</h3>
                  {saveStatus && (
                    <div className={`text-xs font-bold px-3 py-1 rounded-full animate-in fade-in slide-in-from-right-4 ${
                      saveStatus.type === "success" ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
                    }`}>
                      {saveStatus.message}
                    </div>
                  )}
                </div>
              <form onSubmit={saveSettings} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mono-text">Display Name</label>
                    <input name="name" defaultValue={user.name} className="w-full bg-muted/30 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mono-text">Email Address</label>
                    <input name="email" defaultValue={user.email} className="w-full bg-muted/30 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-all" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mono-text">Bio / Summary</label>
                  <textarea name="bio" defaultValue={user.bio} rows={4} className="w-full bg-muted/30 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-all resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mono-text">Location</label>
                    <input name="location" defaultValue={user.location} className="w-full bg-muted/30 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mono-text">Website / Blog</label>
                    <input name="blog" defaultValue={user.blog} className="w-full bg-muted/30 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-all" />
                  </div>
                </div>
                <div className="pt-6 border-t border-border flex justify-end">
                  <button 
                    disabled={savingSettings}
                    className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                  >
                    {savingSettings ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Settings size={18} />}
                    Save Profile
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
