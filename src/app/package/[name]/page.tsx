"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import "highlight.js/styles/github-dark.css";
import { 
  Package, 
  Download, 
  Github, 
  ExternalLink, 
  Shield, 
  Calendar, 
  User, 
  Copy, 
  Check,
  Terminal,
  History,
  FileText,
  Layers,
  AlertTriangle,
  Info
} from "lucide-react";

export default function PackagePage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = use(params);
  const [pkg, setPkg] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("readme");

  useEffect(() => {
    fetch(`/api/package/${name}`)
      .then((res) => res.json())
      .then((data) => {
        setPkg(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [name]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-20 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!pkg || pkg.error) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">Package not found</h1>
        <p className="text-muted-foreground mb-8">The package "{name}" does not exist in our registry.</p>
        <Link href="/explore" className="text-primary hover:underline">Back to Explore</Link>
      </div>
    );
  }

  const latestVersion = pkg.versions?.[0] || { version: "1.0.0", readmeContent: "" };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="mb-8">
            <div className="flex items-center gap-3 text-muted-foreground text-sm mono-text mb-4">
              <Link href="/explore" className="hover:text-primary transition-colors">Packages</Link>
              <span>/</span>
              <span className="text-foreground">{pkg.name}</span>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">{pkg.name}</h1>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs mono-text font-bold">
                  v{latestVersion.version}
                </span>
                {pkg.isVerified === 1 && (
                  <span className="px-3 py-1 rounded-full border border-green-500/30 bg-green-500/10 text-green-500 text-xs mono-text font-bold flex items-center gap-1">
                    <Shield size={12} /> Verified
                  </span>
                )}
              </div>
            </div>
            
            {pkg.isDeprecated === 1 && (
              <div className="mb-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/50 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={20} />
                <div>
                  <h3 className="font-bold text-amber-500 text-sm uppercase tracking-wider mb-1">Package Deprecated</h3>
                  <p className="text-sm text-amber-200/80">
                    {pkg.deprecationMessage || "This package has been deprecated by its author and may no longer be maintained."}
                  </p>
                </div>
              </div>
            )}

            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {pkg.description}
            </p>

            <div className="flex flex-wrap gap-3">
              <div 
                onClick={() => copyToClipboard(`finn add ${pkg.name}`)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-black border border-border cursor-pointer group hover:border-primary/50 transition-all shadow-xl"
              >
                <Terminal size={18} className="text-primary" />
                <code className="text-sm mono-text text-zinc-100">finn add {pkg.name}</code>
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-border mb-8">
            <div className="flex gap-8 overflow-x-auto pb-px scrollbar-hide">
              {[
                { id: "readme", label: "Readme", icon: FileText },
                { id: "versions", label: "Versions", icon: History },
                { id: "dependencies", label: "Dependencies", icon: Layers },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                    activeTab === tab.id 
                      ? "border-primary text-primary" 
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="">
            {activeTab === "readme" && (
              <div className="bg-muted/10 border border-border rounded-xl p-6 md:p-10 animate-in fade-in duration-500 overflow-hidden">
                <article className="prose prose-invert prose-zinc max-w-none 
                  prose-headings:font-bold prose-headings:tracking-tight
                  prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                  prose-code:text-primary-foreground prose-code:bg-primary/10 prose-code:px-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                  prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-border prose-pre:rounded-lg
                  prose-img:rounded-lg prose-img:border prose-img:border-border
                  prose-table:border prose-table:border-border prose-th:bg-muted/50 prose-th:px-4 prose-th:py-2 prose-td:px-4 prose-td:py-2">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw, rehypeHighlight as any]}
                      components={{
                        p: ({ children }: any) => {
                          const childrenArray = React.Children.toArray(children);
                          const hasBlockElement = childrenArray.some((child: any) => {
                            if (!child || typeof child !== "object") return false;
                            const type = child.type;
                            const tagName = child.props?.node?.tagName || (typeof type === "string" ? type : null);
                            return (
                              tagName === "div" || 
                              tagName === "table" || 
                              tagName === "blockquote" || 
                              tagName === "pre" ||
                              (child.props && (child.props.mdxType || child.props.originalType))
                            );
                          });
                          if (hasBlockElement) return <div className="mb-4 last:mb-0">{children}</div>;
                          return <p className="mb-4 last:mb-0">{children}</p>;
                        }
                      }}
                    >
                    {latestVersion.readmeContent || "No README provided for this package."}
                  </ReactMarkdown>
                </article>
              </div>
            )}

            {activeTab === "versions" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6 bg-muted/30 p-4 rounded-lg border border-border/50">
                  <Info size={16} className="text-primary" />
                  Showing the full publication history of {pkg.name}.
                </div>
                {pkg.versions?.map((v: any) => (
                  <div key={v.id} className="dev-card flex items-center justify-between hover:border-primary/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="font-bold text-lg mono-text text-foreground">v{v.version}</div>
                      {v.version === latestVersion.version && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/30 uppercase font-bold tracking-tighter">Latest</span>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground mb-1">{new Date(v.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                      <div className="text-[10px] text-muted-foreground font-mono opacity-40 uppercase tracking-widest">Hash: {v.id.substring(0, 8)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "dependencies" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6 bg-muted/30 p-4 rounded-lg border border-border/50">
                  <Layers size={16} className="text-primary" />
                  Direct dependencies required by {pkg.name} v{latestVersion.version}.
                </div>
                {pkg.dependencies && pkg.dependencies.length > 0 ? (
                  <div className="grid gap-4">
                    {pkg.dependencies.map((dep: any) => (
                      <div key={dep.id} className="dev-card flex items-center justify-between hover:border-primary/30 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <Package size={20} />
                          </div>
                          <div>
                            <Link href={`/package/${dep.dependencyName}`} className="font-bold text-lg hover:text-primary transition-colors block">
                              {dep.dependencyName}
                            </Link>
                          </div>
                        </div>
                        <div className="mono-text text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                          {dep.versionRange}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="dev-card text-center py-20 bg-muted/5 border-dashed">
                    <Package size={40} className="mx-auto text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground font-medium">No dependencies required.</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">This package is standalone and has zero dependencies.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-80 space-y-8">
          <div className="dev-card space-y-6 shadow-2xl bg-muted/5">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 mono-text">Install</h3>
              <p className="text-[10px] text-muted-foreground mb-2 uppercase tracking-tighter font-bold">Latest version:</p>
              <div className="bg-black/80 p-3 rounded-lg border border-border font-mono text-xs overflow-x-auto text-zinc-100 shadow-inner group relative">
                <span className="text-primary mr-2">$</span>
                finn add {pkg.name}@{latestVersion.version}
                <button 
                  onClick={() => copyToClipboard(`finn add ${pkg.name}@${latestVersion.version}`)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-800 p-1.5 rounded hover:bg-zinc-700"
                >
                  <Copy size={12} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1 mono-text">License</h4>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Shield size={14} className="text-primary" />
                  {pkg.license || "MIT"}
                </div>
              </div>
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1 mono-text">Downloads</h4>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Download size={14} className="text-primary" />
                  {pkg.downloads.toLocaleString()}
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1 mono-text">Repository</h4>
              <a href={pkg.repoUrl} target="_blank" className="flex items-center gap-2 text-sm text-primary hover:underline font-medium group">
                <Github size={14} className="group-hover:scale-110 transition-transform" />
                GitHub Repository
                <ExternalLink size={12} className="opacity-50" />
              </a>
            </div>

            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1 mono-text">Published</h4>
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                <Calendar size={14} />
                {new Date(pkg.createdAt).toLocaleDateString()}
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3 mono-text">Maintainer</h4>
              <Link href={`/user/${pkg.owner?.login}`} className="flex items-center gap-3 group bg-muted/20 p-2 rounded-lg border border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all">
                <img src={pkg.owner?.avatarUrl} alt={pkg.owner?.login} className="w-10 h-10 rounded-full border border-border group-hover:border-primary transition-colors shadow-lg" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold group-hover:text-primary transition-colors truncate">
                    {pkg.owner?.name || pkg.owner?.login}
                  </div>
                  <div className="text-[10px] text-muted-foreground mono-text">@{pkg.owner?.login}</div>
                </div>
              </Link>
            </div>
          </div>

          <div className="dev-card bg-primary/5 border-primary/20 shadow-lg relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 text-primary/10 group-hover:scale-110 transition-transform">
              <Github size={80} />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-3 mono-text relative z-10">Help improve this package</h3>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed relative z-10 font-medium">
              Found a bug or have a suggestion? Open an issue or submit a pull request on the GitHub repository.
            </p>
            <a href={pkg.repoUrl + "/issues"} target="_blank" className="text-xs font-bold text-primary hover:underline mono-text uppercase tracking-wider relative z-10 flex items-center gap-2">
              Open Issue <ExternalLink size={10} />
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
