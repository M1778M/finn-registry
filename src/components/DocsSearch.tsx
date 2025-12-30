"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Search, FileText, Hash, CornerDownLeft } from "lucide-react";
import Fuse from "fuse.js";
import { DOCS_CONFIG } from "@/lib/docs-config";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const allDocs = DOCS_CONFIG.flatMap((section) => 
  section.items.map(item => ({
    ...item,
    section: section.title
  }))
);

const fuse = new Fuse(allDocs, {
  keys: ["title", "description", "content"],
  threshold: 0.3,
  includeMatches: true
});

export function DocsSearch() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const results = React.useMemo(() => {
    if (!query) return [];
    return fuse.search(query).slice(0, 8);
  }, [query]);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative w-full flex items-center gap-2 px-3 h-10 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-all text-sm text-muted-foreground group"
      >
        <Search size={16} className="group-hover:text-primary transition-colors" />
        <span>Search docs...</span>
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 border-none shadow-2xl bg-popover/95 backdrop-blur-sm max-w-2xl top-[20%] translate-y-0 overflow-hidden">
          <DialogTitle className="sr-only">Search Documentation</DialogTitle>
          <Command className="rounded-xl border border-border bg-transparent text-popover-foreground overflow-hidden">
            <div className="flex items-center border-b border-border px-4 py-3">
              <Search className="mr-3 h-4 w-4 shrink-0 opacity-50" />
              <Command.Input
                placeholder="Type to search..."
                value={query}
                onValueChange={setQuery}
                className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <Command.List className="max-h-[400px] overflow-y-auto p-2">
              <Command.Empty className="py-6 text-center text-sm">No results found.</Command.Empty>
              
              {results.length > 0 ? (
                <Command.Group heading="Documentation">
                  {results.map((result) => (
                    <Command.Item
                      key={result.item.slug}
                      value={result.item.title}
                      onSelect={() => {
                        runCommand(() => router.push(`/docs/${result.item.slug}`));
                      }}
                      className="relative flex cursor-default select-none items-center rounded-md px-3 py-3 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 gap-3"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-muted">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-medium truncate">{result.item.title}</span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest mono-text">
                          {result.item.section}
                        </span>
                      </div>
                      <div className="ml-auto flex items-center text-muted-foreground/50">
                        <CornerDownLeft className="h-3 w-3" />
                      </div>
                    </Command.Item>
                  ))}
                </Command.Group>
              ) : (
                <div className="p-2 space-y-4">
                  <p className="px-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mono-text">Quick Links</p>
                  <div className="grid grid-cols-2 gap-2">
                    {allDocs.slice(0, 4).map((doc) => (
                      <button
                        key={doc.slug}
                        onClick={() => runCommand(() => router.push(`/docs/${doc.slug}`))}
                        className="flex items-center gap-2 p-3 rounded-lg border border-border hover:bg-accent transition-colors text-left"
                      >
                        <Hash className="h-3 w-3 text-primary" />
                        <span className="text-xs font-medium truncate">{doc.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </Command.List>
            <div className="flex items-center gap-4 border-t border-border px-4 py-3 bg-muted/30">
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase tracking-tight font-medium">
                <kbd className="px-1.5 py-0.5 rounded border border-border bg-background">↑↓</kbd>
                <span>Navigate</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase tracking-tight font-medium">
                <kbd className="px-1.5 py-0.5 rounded border border-border bg-background">Enter</kbd>
                <span>Select</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase tracking-tight font-medium">
                <kbd className="px-1.5 py-0.5 rounded border border-border bg-background">Esc</kbd>
                <span>Close</span>
              </div>
            </div>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
