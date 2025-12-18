import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Box, Copy, Github, Calendar, Download, ShieldCheck, Check, Tag, User, Clock, ExternalLink, FileText } from 'lucide-react'
import MarkdownRenderer from '../components/MarkdownRenderer'

interface Version {
  version: string
  commit_hash: string | null
  created_at: number
}

interface PackageData {
  name: string
  description: string
  repo_url: string
  homepage: string | null
  keywords: string | null
  license: string
  downloads: number
  created_at: number
  updated_at: number
  owner_name: string | null
  owner_avatar: string | null
  versions: Version[]
}

export default function PackageDetail() {
  const { name } = useParams()
  const [pkg, setPkg] = useState<PackageData | null>(null)
  const [readme, setReadme] = useState<string | null>(null)
  const [readmeLoading, setReadmeLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'info' | 'readme'>('info')

  useEffect(() => {
    fetch(`/api/packages/${name}`)
      .then(res => {
        if (!res.ok) throw new Error('Package not found')
        return res.json()
      })
      .then(setPkg)
      .catch(err => setError(err.message))
  }, [name])

  useEffect(() => {
    if (activeTab === 'readme' && !readme && name) {
      setReadmeLoading(true)
      fetch(`/api/packages/${name}/readme`)
        .then(res => res.json())
        .then(data => {
          if (data.readme) {
            setReadme(data.readme)
          } else {
            setReadme(null)
          }
        })
        .catch(() => setReadme(null))
        .finally(() => setReadmeLoading(false))
    }
  }, [activeTab, name, readme])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`finn add ${name}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatRelativeDate = (timestamp: number) => {
    const now = Date.now() / 1000
    const diff = now - timestamp
    
    if (diff < 60) return 'just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
    return formatDate(timestamp)
  }

  const parseKeywords = (keywords: string | null): string[] => {
    if (!keywords) return []
    try {
      return JSON.parse(keywords)
    } catch {
      return []
    }
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-in fade-in duration-500">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-red-500/20 rounded-full blur-3xl"></div>
          <div className="relative w-24 h-24 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-full flex items-center justify-center border border-zinc-700/50 shadow-2xl">
            <Box size={48} className="text-red-400" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
          Package Not Found
        </h1>
        <p className="text-zinc-400 mb-8 max-w-md leading-relaxed">
          The package "{name}" doesn't exist or has been removed from the registry.
        </p>
        <Link
          to="/packages"
          className="px-6 py-3 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-xl text-emerald-300 hover:text-emerald-200 hover:border-emerald-400/50 transition-all duration-300 font-medium flex items-center gap-2 hover:shadow-lg hover:shadow-emerald-500/10"
        >
          <Box size={18} />
          Browse all packages →
        </Link>
      </div>
    )
  }

  if (!pkg) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-500">
        <div className="relative mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-700/50 shadow-2xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
          </div>
        </div>
        <p className="text-zinc-400 text-lg font-medium">Loading package details...</p>
      </div>
    )
  }

  const keywords = parseKeywords(pkg.keywords)
  const latestVersion = pkg.versions?.[0]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-16 animate-in fade-in duration-700">
      <div className="md:col-span-2">
        <div className="flex items-center gap-4 mb-6 animate-in slide-in-from-left duration-500 delay-100">
          <span className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 text-xs font-semibold px-3 py-1.5 rounded-full border border-emerald-500/30 flex items-center gap-1.5 backdrop-blur-sm">
            <ShieldCheck size={14} className="animate-pulse" /> Verified Package
          </span>
          {latestVersion && (
            <span className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-400 text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-500/30 flex items-center gap-1.5 backdrop-blur-sm">
              <Tag size={14} /> v{latestVersion.version}
            </span>
          )}
        </div>

        <h1 className="text-6xl font-extrabold mb-6 flex items-center gap-6 animate-in slide-in-from-bottom duration-600 delay-200">
          <div className="p-4 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl text-emerald-400 shadow-lg shadow-emerald-500/10 border border-zinc-700/50">
            <Box size={48} className="drop-shadow-sm" />
          </div>
          <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            {pkg.name}
          </span>
        </h1>

        <p className="text-xl text-zinc-300 mb-8 leading-relaxed animate-in slide-in-from-bottom duration-600 delay-300 max-w-4xl">
          {pkg.description}
        </p>

        {/* Keywords */}
        {keywords.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-10 animate-in slide-in-from-bottom duration-600 delay-400">
            {keywords.map((keyword, index) => (
              <span
                key={keyword}
                className="px-4 py-2 bg-gradient-to-r from-zinc-800/80 to-zinc-900/80 border border-zinc-700/60 rounded-full text-sm text-zinc-300 hover:border-zinc-600/80 hover:bg-zinc-700/80 transition-all duration-200 backdrop-blur-sm animate-in slide-in-from-bottom"
                style={{ animationDelay: `${400 + index * 50}ms` }}
              >
                #{keyword}
              </span>
            ))}
          </div>
        )}

        {/* Owner */}
        {pkg.owner_name && (
          <Link
            to={`/users/${pkg.owner_name}`}
            className="inline-flex items-center gap-4 p-4 bg-gradient-to-r from-zinc-900/80 to-zinc-800/80 border border-zinc-700/60 rounded-2xl hover:border-zinc-600/80 hover:shadow-lg hover:shadow-zinc-900/20 transition-all duration-300 mb-10 animate-in slide-in-from-left duration-600 delay-500 backdrop-blur-sm group"
          >
            {pkg.owner_avatar ? (
              <img src={pkg.owner_avatar} alt={pkg.owner_name} className="w-12 h-12 rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300" />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl flex items-center justify-center text-emerald-400 border border-emerald-500/30 group-hover:scale-105 transition-all duration-300">
                <User size={24} />
              </div>
            )}
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wide font-medium">Published by</p>
              <p className="font-bold text-lg text-white group-hover:text-emerald-300 transition-colors duration-300">{pkg.owner_name}</p>
            </div>
          </Link>
        )}

        {/* Tabs */}
        <div className="border-t border-zinc-700/50 pt-12 mt-12 animate-in fade-in duration-600 delay-600">
          <div className="flex gap-2 mb-8 bg-zinc-900/30 p-2 rounded-xl border border-zinc-700/30 backdrop-blur-sm">
            <button
              onClick={() => setActiveTab('info')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === 'info'
                  ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/30 shadow-lg shadow-emerald-500/10'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              } flex items-center justify-center gap-2`}
            >
              <FileText size={18} />
              Information
            </button>
            <button
              onClick={() => setActiveTab('readme')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === 'readme'
                  ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/30 shadow-lg shadow-emerald-500/10'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              } flex items-center justify-center gap-2`}
            >
              <Github size={18} />
              README
            </button>
          </div>

          {/* Info Tab */}
          {activeTab === 'info' && (
            <div className="space-y-8 animate-in slide-in-from-bottom duration-600 delay-700">
              <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 border border-zinc-700/60 rounded-2xl p-8 shadow-lg shadow-zinc-900/20 backdrop-blur-sm">
                <h4 className="text-white font-bold mb-6 flex items-center gap-3">
                  <Download size={20} className="text-emerald-400" />
                  Installation
                </h4>
                <div className="flex items-center gap-3 bg-gradient-to-r from-black to-zinc-900/50 rounded-xl p-5 mb-4 border border-zinc-700/50 hover:border-emerald-500/30 transition-all duration-300 group">
                  <code className="text-emerald-300 flex-1 font-mono text-sm">$ finn add {pkg.name}</code>
                  <button
                    onClick={copyToClipboard}
                    className="p-2 hover:bg-emerald-500/10 rounded-lg transition-all duration-200 group-hover:scale-110"
                    title="Copy to clipboard"
                  >
                    {copied ? <Check size={20} className="text-emerald-400" /> : <Copy size={20} className="text-zinc-400 group-hover:text-emerald-400" />}
                  </button>
                </div>
                <p className="text-xs text-zinc-500 flex items-center gap-2">
                  <Tag size={14} />
                  Or with specific version: <code className="text-emerald-400 font-mono">finn add {pkg.name}@{latestVersion?.version}</code>
                </p>
              </div>

              <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 border border-zinc-700/60 rounded-2xl p-8 shadow-lg shadow-zinc-900/20 backdrop-blur-sm">
                <h4 className="text-white font-bold mb-6 flex items-center gap-3">
                  <Box size={20} className="text-blue-400" />
                  Usage Example
                </h4>
                <pre className="bg-gradient-to-br from-black to-zinc-900/50 rounded-xl p-6 overflow-x-auto text-emerald-300 text-sm border border-zinc-700/50 font-mono leading-relaxed">
                  <code>{`import ${pkg.name}

fn main() {
    // Your ${pkg.name} code here
    println("Hello, ${pkg.name}!")
}`}</code>
                </pre>
              </div>

              {pkg.homepage && (
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8">
                  <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <ExternalLink size={18} />
                    Links
                  </h4>
                  <div className="space-y-2">
                    <a
                      href={pkg.repo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition"
                    >
                      <Github size={16} /> Repository
                    </a>
                    <a
                      href={pkg.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition"
                    >
                      <ExternalLink size={16} /> Homepage
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* README Tab */}
          {activeTab === 'readme' && (
            <div className="animate-in slide-in-from-bottom duration-600 delay-700">
              {readmeLoading && (
                <div className="flex items-center justify-center py-16">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-700/50 shadow-2xl">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-400"></div>
                    </div>
                    <p className="text-zinc-400 text-sm mt-4 font-medium">Loading README...</p>
                  </div>
                </div>
              )}
              {readme ? (
                <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 border border-zinc-700/60 rounded-3xl p-8 shadow-2xl shadow-zinc-900/20 backdrop-blur-sm">
                  <MarkdownRenderer content={readme} className="markdown-enhanced" />
                </div>
              ) : (
                <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 border border-zinc-700/60 rounded-3xl p-12 text-center shadow-2xl shadow-zinc-900/20 backdrop-blur-sm">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-700/50 shadow-xl mx-auto">
                      <FileText size={32} className="text-zinc-600" />
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-zinc-300 mb-3">No README Available</h4>
                  <p className="text-zinc-500 mb-6 max-w-md mx-auto leading-relaxed">
                    This package doesn't have a README file in its repository yet.
                  </p>
                  <a
                    href={pkg.repo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30 rounded-xl text-purple-300 hover:text-purple-200 hover:border-purple-400/50 transition-all duration-300 font-medium hover:shadow-lg hover:shadow-purple-500/10"
                  >
                    <Github size={18} />
                    View on GitHub →
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Versions */}
        {pkg.versions && pkg.versions.length > 0 && (
          <div className="border-t border-zinc-700/50 pt-12 mt-12 animate-in fade-in duration-600 delay-800">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-white">
              <Tag size={24} className="text-emerald-400" />
              Versions ({pkg.versions.length})
            </h3>
            <div className="space-y-4">
              {pkg.versions.map((version, index) => (
                <div
                  key={version.version}
                  className={`flex items-center justify-between p-6 bg-gradient-to-r rounded-2xl border backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
                    index === 0
                      ? 'from-emerald-500/10 to-teal-500/10 border-emerald-500/30 shadow-lg shadow-emerald-500/10'
                      : 'from-zinc-900/80 to-zinc-800/80 border-zinc-700/60 hover:border-zinc-600/80 hover:shadow-zinc-900/20'
                  } animate-in slide-in-from-bottom`}
                  style={{ animationDelay: `${800 + index * 100}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <span className={`font-mono font-bold text-lg ${index === 0 ? 'text-emerald-300' : 'text-white'}`}>
                      v{version.version}
                    </span>
                    {index === 0 && (
                      <span className="text-xs bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30 font-semibold">
                        latest
                      </span>
                    )}
                    {version.commit_hash && (
                      <span className="text-xs text-zinc-500 font-mono bg-zinc-800/50 px-2 py-1 rounded-lg">
                        {version.commit_hash.slice(0, 7)}
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-zinc-400 flex items-center gap-2 font-medium">
                    <Clock size={16} />
                    {formatRelativeDate(version.created_at)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="space-y-8 animate-in slide-in-from-right duration-600 delay-300">
        {/* Install Card */}
        <div className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 border border-zinc-700/60 rounded-3xl p-8 shadow-2xl shadow-zinc-900/30 backdrop-blur-sm">
          <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Download size={16} className="text-emerald-400" />
            Install
          </h3>
          <div
            onClick={copyToClipboard}
            className="bg-gradient-to-r from-black to-zinc-900/50 rounded-xl p-4 flex items-center justify-between group cursor-pointer border border-zinc-700/50 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300"
          >
            <code className="text-emerald-300 flex-1 font-mono text-sm">$ finn add {pkg.name}</code>
            {copied ? <Check size={18} className="text-emerald-400 animate-pulse" /> : <Copy size={18} className="text-zinc-500 group-hover:text-emerald-400 transition-colors" />}
          </div>
          {latestVersion && (
            <p className="text-xs text-zinc-500 mt-4 flex items-center gap-2">
              <Tag size={14} className="text-emerald-400" />
              Latest: <span className="text-emerald-300 font-mono">v{latestVersion.version}</span>
            </p>
          )}
        </div>

        {/* Metadata Card */}
        <div className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 border border-zinc-700/60 rounded-3xl p-8 shadow-2xl shadow-zinc-900/30 backdrop-blur-sm">
          <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <ShieldCheck size={16} className="text-blue-400" />
            Metadata
          </h3>
          <div className="space-y-5">
            <div className="flex items-center justify-between py-2 border-b border-zinc-700/30">
              <span className="text-zinc-400 flex items-center gap-2 text-sm">
                <Download size={16} className="text-emerald-400"/>
                Downloads
              </span>
              <span className="font-mono font-bold text-white text-lg">{pkg.downloads.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-zinc-700/30">
              <span className="text-zinc-400 flex items-center gap-2 text-sm">
                <Tag size={16} className="text-blue-400"/>
                License
              </span>
              <span className="font-mono text-sm text-white bg-zinc-800/50 px-2 py-1 rounded-lg">{pkg.license || 'MIT'}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-zinc-700/30">
              <span className="text-zinc-400 flex items-center gap-2 text-sm">
                <Github size={16} className="text-purple-400"/>
                Repository
              </span>
              <a
                href={pkg.repo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 transition-colors truncate max-w-[120px] flex items-center gap-1 hover:underline"
              >
                GitHub <ExternalLink size={12} />
              </a>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-zinc-700/30">
              <span className="text-zinc-400 flex items-center gap-2 text-sm">
                <Calendar size={16} className="text-orange-400"/>
                Created
              </span>
              <span className="text-zinc-200 text-sm font-medium">{formatDate(pkg.created_at)}</span>
            </div>
            {pkg.updated_at && pkg.updated_at !== pkg.created_at && (
              <div className="flex items-center justify-between py-2">
                <span className="text-zinc-400 flex items-center gap-2 text-sm">
                  <Clock size={16} className="text-yellow-400"/>
                  Updated
                </span>
                <span className="text-zinc-200 text-sm font-medium">{formatRelativeDate(pkg.updated_at)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Links */}
        {pkg.homepage && (
          <div className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 border border-zinc-700/60 rounded-3xl p-8 shadow-2xl shadow-zinc-900/30 backdrop-blur-sm">
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <ExternalLink size={16} className="text-cyan-400" />
              Links
            </h3>
            <a
              href={pkg.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-cyan-400 hover:text-cyan-300 transition-all duration-300 hover:translate-x-1 group"
            >
              <div className="w-8 h-8 bg-cyan-500/10 rounded-lg flex items-center justify-center border border-cyan-500/30 group-hover:bg-cyan-500/20 transition-colors">
                <ExternalLink size={16} />
              </div>
              <span className="font-medium">Homepage</span>
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
