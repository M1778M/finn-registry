import ReactMarkdown from 'react-markdown'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`prose prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        components={{
          h1: ({ children }) => <h1 className="text-3xl font-bold mt-6 mb-4 text-white">{children}</h1>,
          h2: ({ children }) => <h2 className="text-2xl font-bold mt-5 mb-3 text-white">{children}</h2>,
          h3: ({ children }) => <h3 className="text-xl font-bold mt-4 mb-2 text-white">{children}</h3>,
          p: ({ children }) => <p className="text-zinc-300 mb-4 leading-7">{children}</p>,
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline">
              {children}
            </a>
          ),
          code: (props: unknown) => {
            const codeProps = props as { children: string | string[] }
            return typeof codeProps.children === 'string' ? (
              <code className="bg-black/50 text-indigo-300 px-2 py-1 rounded text-sm font-mono">{codeProps.children}</code>
            ) : (
              <pre className="bg-black/50 border border-zinc-800 rounded-lg p-4 overflow-x-auto mb-4">
                <code className="text-zinc-300 font-mono text-sm">{codeProps.children}</code>
              </pre>
            )
          },
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-indigo-500 pl-4 py-2 my-4 text-zinc-400 italic">
              {children}
            </blockquote>
          ),
          ul: ({ children }) => <ul className="list-disc list-inside mb-4 text-zinc-300 space-y-2">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside mb-4 text-zinc-300 space-y-2">{children}</ol>,
          li: ({ children }) => <li className="ml-4">{children}</li>,
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
              <table className="w-full border-collapse">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-zinc-800/50">{children}</thead>,
          tr: ({ children }) => <tr className="border-b border-zinc-800">{children}</tr>,
          th: ({ children }) => <th className="px-4 py-2 text-left text-white font-bold">{children}</th>,
          td: ({ children }) => <td className="px-4 py-2 text-zinc-300">{children}</td>,
          hr: () => <hr className="my-6 border-zinc-800" />,
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt}
              className="max-w-full h-auto rounded-lg my-4 border border-zinc-800"
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
