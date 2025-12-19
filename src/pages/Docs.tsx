import { useState } from 'react'
import { Terminal, Download, Package, Upload, BookOpen, ChevronRight, Copy, Check, Zap, Shield, Globe } from 'lucide-react'

type Section = 'getting-started' | 'installation' | 'usage' | 'publishing' | 'configuration'

export default function Docs() {
  const [activeSection, setActiveSection] = useState<Section>('getting-started')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const CodeBlock = ({ code, language = 'bash' }: { code: string; language?: string }) => (
    <div className="relative group">
      <pre className="bg-black border border-zinc-800 rounded-lg p-4 overflow-x-auto">
        <code className={`text-sm font-mono ${language === 'toml' ? 'text-amber-400' : 'text-indigo-400'}`}>{code}</code>
      </pre>
      <button
        onClick={() => copyCode(code)}
        className="absolute top-3 right-3 p-2 bg-zinc-800 rounded-md opacity-0 group-hover:opacity-100 transition hover:bg-zinc-700"
      >
        {copiedCode === code ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-zinc-400" />}
      </button>
    </div>
  )

  const sections = [
    { id: 'getting-started', label: 'Getting Started', icon: BookOpen },
    { id: 'installation', label: 'Installation', icon: Download },
    { id: 'usage', label: 'Using Packages', icon: Package },
    { id: 'publishing', label: 'Publishing', icon: Upload },
    { id: 'configuration', label: 'Configuration', icon: Terminal },
  ]

  const currentIndex = sections.findIndex(section => section.id === activeSection)
  const prevSection = currentIndex > 0 ? sections[currentIndex - 1] : null
  const nextSection = currentIndex < sections.length - 1 ? sections[currentIndex + 1] : null

  return (
    <div className="flex gap-12">
      {/* Sidebar */}
      <aside className="w-64 shrink-0">
        <div className="sticky top-24">
          <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4">Documentation</h3>
          <nav className="space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id as Section)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition ${
                  activeSection === section.id
                    ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                }`}
              >
                <section.icon size={18} />
                {section.label}
                {activeSection === section.id && <ChevronRight size={16} className="ml-auto" />}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 min-w-0">
        {activeSection === 'getting-started' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-4">Getting Started with Finn</h1>
              <p className="text-xl text-zinc-400 leading-relaxed">
                Finn is the official package manager for the Fin programming language. 
                Fast, secure, and distributed.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 mb-4">
                  <Zap size={24} />
                </div>
                <h3 className="font-bold text-lg mb-2">Lightning Fast</h3>
                <p className="text-zinc-400 text-sm">Parallel downloads and efficient caching for blazing fast installs.</p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-400 mb-4">
                  <Shield size={24} />
                </div>
                <h3 className="font-bold text-lg mb-2">Secure by Default</h3>
                <p className="text-zinc-400 text-sm">Verified packages with checksum validation and signed commits.</p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 mb-4">
                  <Globe size={24} />
                </div>
                <h3 className="font-bold text-lg mb-2">Distributed</h3>
                <p className="text-zinc-400 text-sm">Git-based distribution means packages are always available.</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">Quick Start</h3>
              <p className="text-zinc-400 mb-4">Install Finn and add your first package in seconds:</p>
              <CodeBlock code={`# Install Finn
curl -fsSL https://finn-lang.org/install.sh | sh

# Add a package to your project
finn add std

# Run your project
finn run`} />
            </div>
          </div>
        )}

        {activeSection === 'installation' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-4">Installation</h1>
              <p className="text-xl text-zinc-400 leading-relaxed">
                Install the Finn CLI on your system to start managing packages.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">macOS / Linux</h2>
                <p className="text-zinc-400 mb-4">Run this command in your terminal:</p>
                <CodeBlock code="curl -fsSL https://finn-lang.org/install.sh | sh" />
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Windows</h2>
                <p className="text-zinc-400 mb-4">Run this command in PowerShell (as Administrator):</p>
                <CodeBlock code="irm https://finn-lang.org/install.ps1 | iex" />
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">From Source</h2>
                <p className="text-zinc-400 mb-4">Build from the official repository:</p>
                <CodeBlock code={`git clone https://github.com/M1778M/finn.git
cd finn
make install`} />
              </div>

               <div>
                 <h2 className="text-2xl font-bold mb-4">Example Fin Code</h2>
                 <p className="text-zinc-400 mb-4">A simple Fin program using imported packages:</p>
                 <CodeBlock code={`import "std" as std;
import "http" as http;

struct UserData {
    name <string>,
    age <int>
}

fun main() <noret> {
    let user <UserData> = UserData{name: "Alice", age: 30};

    printf("Hello, %s! You are %d years old.\n",
           user.name, user.age);

    let response <auto> = http.get("https://api.example.com/user");
    printf("API Response: %s\n", response.body);
}`} language="fin" />
               </div>
            </div>
          </div>
        )}

        {activeSection === 'usage' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-4">Using Packages</h1>
              <p className="text-xl text-zinc-400 leading-relaxed">
                Learn how to add, update, and manage dependencies in your Fin projects.
              </p>
            </div>

            <div className="space-y-6">
               <div>
                 <h2 className="text-2xl font-bold mb-4">Adding Packages</h2>
                 <p className="text-zinc-400 mb-4">Add a package to your project:</p>
                 <CodeBlock code="finn add std" />
                 <p className="text-zinc-400 mt-4 mb-4">Add a specific version:</p>
                 <CodeBlock code="finn add http@1.2.0" />
               </div>

               <div>
                 <h2 className="text-2xl font-bold mb-4">Removing Packages</h2>
                 <p className="text-zinc-400 mb-4">Remove a package from your project:</p>
                 <CodeBlock code="finn remove http" />
               </div>

               <div>
                 <h2 className="text-2xl font-bold mb-4">Updating Packages</h2>
                 <p className="text-zinc-400 mb-4">Update all packages to their latest versions:</p>
                 <CodeBlock code="finn update" />
                 <p className="text-zinc-400 mt-4 mb-4">Update a specific package:</p>
                 <CodeBlock code="finn update std" />
               </div>

               <div>
                 <h2 className="text-2xl font-bold mb-4">Listing Packages</h2>
                 <p className="text-zinc-400 mb-4">List all installed packages:</p>
                 <CodeBlock code="finn list" />
               </div>

               <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                 <h3 className="font-bold text-lg mb-3">Import in Code</h3>
                 <p className="text-zinc-400 mb-4">Use installed packages in your Fin code:</p>
                 <CodeBlock code={`import "std" as std;
import "http" as http;

fun main() <noret> {
    let response <auto> = http.get("https://api.example.com");
    printf("%s\n", response.body);
}`} language="fin" />
               </div>
            </div>
          </div>
        )}

        {activeSection === 'publishing' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-4">Publishing Packages</h1>
              <p className="text-xl text-zinc-400 leading-relaxed">
                Share your packages with the Fin community by publishing to the registry.
              </p>
            </div>

            <div className="space-y-6">
               <div>
                 <h2 className="text-2xl font-bold mb-4">1. Create a finn.toml</h2>
                 <p className="text-zinc-400 mb-4">Every package needs a manifest file:</p>
                 <CodeBlock code={`[project]
name = "my-package"
version = "1.0.0"
entrypoint = "lib.fin"
description = "A helpful description"
repository = "https://github.com/username/my-package"
license = "MIT"

[packages]
std = "std"`} language="toml" />
               </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">2. Login to Finn</h2>
                <p className="text-zinc-400 mb-4">Authenticate with your API token:</p>
                <CodeBlock code="finn login" />
                <p className="text-zinc-400 mt-4">You can find your API token in your <a href="/account" className="text-indigo-400 hover:underline">Account Settings</a>.</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">3. Publish</h2>
                <p className="text-zinc-400 mb-4">Publish your package to the registry:</p>
                <CodeBlock code="finn publish" />
              </div>

              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-3 text-amber-400">Publishing Guidelines</h3>
                <ul className="text-zinc-400 space-y-2 list-disc list-inside">
                  <li>Package names must be lowercase and can contain hyphens</li>
                  <li>Include a README.md with usage examples</li>
                  <li>Use semantic versioning (major.minor.patch)</li>
                  <li>Tag releases in your Git repository</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'configuration' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-4">Configuration</h1>
              <p className="text-xl text-zinc-400 leading-relaxed">
                Customize Finn's behavior with configuration options.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">finn.toml Reference</h2>
                <p className="text-zinc-400 mb-4">Complete configuration options:</p>
                 <CodeBlock code={`[project]
name = "my-package"          # Required: Package name
version = "1.0.0"            # Required: Semantic version
entrypoint = "lib.fin"       # Required: lib.fin or main.fin
description = "Description"  # Optional: Short description
repository = "https://..."   # Required: Git repository URL
license = "MIT"              # Optional: SPDX license identifier

[packages]
std = "std"                  # Package dependencies
http = "http"                # Direct package references`} language="toml" />
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Global Configuration</h2>
                <p className="text-zinc-400 mb-4">Configure Finn globally at <code className="bg-zinc-800 px-2 py-1 rounded">~/.finn/config.toml</code>:</p>
                <CodeBlock code={`[registry]
url = "https://finn-registry.pages.dev"

[cache]
dir = "~/.finn/cache"
max_size = "1GB"

[network]
timeout = 30
retries = 3`} language="toml" />
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-3">Environment Variables</h3>
                <ul className="text-zinc-400 space-y-3">
                  <li><code className="bg-zinc-800 px-2 py-1 rounded text-indigo-400">FINN_TOKEN</code> - API token for authentication</li>
                  <li><code className="bg-zinc-800 px-2 py-1 rounded text-indigo-400">FINN_REGISTRY</code> - Custom registry URL</li>
                  <li><code className="bg-zinc-800 px-2 py-1 rounded text-indigo-400">FINN_CACHE_DIR</code> - Cache directory path</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        {(prevSection || nextSection) && (
          <div className="flex justify-between items-center pt-8 mt-8 border-t border-zinc-800">
            <div>
              {prevSection && (
                <button
                  onClick={() => setActiveSection(prevSection.id as Section)}
                  className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group"
                >
                  <ChevronRight size={16} className="rotate-180" />
                  <div className="text-left">
                    <div className="text-xs text-zinc-500 uppercase tracking-widest">Previous</div>
                    <div className="font-medium group-hover:text-indigo-400 transition-colors">{prevSection.label}</div>
                  </div>
                </button>
              )}
            </div>

            <div className="flex gap-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id as Section)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    section.id === activeSection
                      ? 'bg-indigo-400 scale-125'
                      : 'bg-zinc-600 hover:bg-zinc-500'
                  }`}
                  title={section.label}
                />
              ))}
            </div>

            <div>
              {nextSection && (
                <button
                  onClick={() => setActiveSection(nextSection.id as Section)}
                  className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group"
                >
                  <div className="text-right">
                    <div className="text-xs text-zinc-500 uppercase tracking-widest">Next</div>
                    <div className="font-medium group-hover:text-indigo-400 transition-colors">{nextSection.label}</div>
                  </div>
                  <ChevronRight size={16} />
                </button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
