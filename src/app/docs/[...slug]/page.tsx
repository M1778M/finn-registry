import { DOCS_CONFIG, getDocBySlug } from "@/lib/docs-config";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { notFound } from "next/navigation";
import Link from "next/link";
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CodeBlock, Callout } from "@/components/DocsComponents";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function DocDynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const fullSlug = slug.join("/");
  const doc = getDocBySlug(fullSlug);

  if (!doc) {
    notFound();
  }

  // Find prev/next docs
  const allDocs = DOCS_CONFIG.flatMap(section => section.items);
  const currentIndex = allDocs.findIndex(item => item.slug === fullSlug);
  const prevDoc = currentIndex > 0 ? allDocs[currentIndex - 1] : null;
  const nextDoc = currentIndex < allDocs.length - 1 ? allDocs[currentIndex + 1] : null;

  // Simple callout processing for :::type ... :::
  const processMarkdown = (content: string) => {
    return content.replace(/:::(info|tip|warning|important)\n([\s\S]*?)\n:::/g, (_, type, inner) => {
      return `\n\n<callout type="${type}">${inner.trim()}</callout>\n\n`;
    });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mono-text uppercase tracking-widest mb-4">
          <Link href="/docs" className="hover:text-primary transition-colors">Docs</Link>
          <ChevronRight size={10} />
          <span className="text-foreground">{doc.title}</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">{doc.title}</h1>
        {doc.description && (
          <p className="text-xl text-muted-foreground leading-relaxed">
            {doc.description}
          </p>
        )}
      </div>

      <div className="prose prose-zinc dark:prose-invert prose-headings:mono-text prose-headings:tracking-tighter prose-pre:p-0 prose-pre:bg-transparent prose-pre:border-none max-w-none prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
        <ReactMarkdown
          rehypePlugins={[rehypeRaw]}
          remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ className, ...props }) => (
                      <h1 className={cn("mt-2 scroll-m-20 text-4xl font-bold tracking-tight", className)} {...props} />
                    ),
                    h2: ({ className, ...props }) => (
                      <h2 className={cn("mt-10 scroll-m-20 border-b pb-1 text-3xl font-semibold tracking-tight first:mt-0", className)} {...props} />
                    ),
                    h3: ({ className, ...props }) => (
                      <h3 className={cn("mt-8 scroll-m-20 text-2xl font-semibold tracking-tight", className)} {...props} />
                    ),
                    p: ({ className, ...props }) => (
                      <p className={cn("leading-7 [&:not(:first-child)]:mt-6", className)} {...props} />
                    ),
                    ul: ({ className, ...props }) => (
                      <ul className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)} {...props} />
                    ),
                    code: ({ className, ...props }) => (
                      <code className={cn("relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold", className)} {...props} />
                    ),
                  }}
        >
          {processMarkdown(doc.content)}
        </ReactMarkdown>
      </div>

      <div className="mt-16 pt-8 border-t border-border grid grid-cols-2 gap-4">
        {prevDoc ? (
          <Link 
            href={`/docs/${prevDoc.slug}`}
            className="group flex flex-col items-start gap-1 p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all"
          >
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest mono-text flex items-center gap-1">
              <ChevronLeft size={10} /> Previous
            </span>
            <span className="text-sm font-medium group-hover:text-primary transition-colors">{prevDoc.title}</span>
          </Link>
        ) : <div />}

        {nextDoc ? (
          <Link 
            href={`/docs/${nextDoc.slug}`}
            className="group flex flex-col items-end gap-1 p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-right"
          >
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest mono-text flex items-center gap-1">
              Next <ChevronRight size={10} />
            </span>
            <span className="text-sm font-medium group-hover:text-primary transition-colors">{nextDoc.title}</span>
          </Link>
        ) : <div />}
      </div>
    </div>
  );
}
