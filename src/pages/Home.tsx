import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, ArrowRight, Download, Package, Users, TrendingUp } from 'lucide-react'

interface PackageResult {
  name: string
  description: string
  downloads: number
}

interface Stats {
  packages: number
  users: number
  downloads: number
}

export default function Home() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<PackageResult[]>([])
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    // Fetch registry stats
    fetch('/api/stats')
      .then(res => res.json())
      .then(setStats)
      .catch(console.error)
  }, [])

  useEffect(() => {
    if (query.length < 1) { setResults([]); return }
    
    // Debounce search
    const timer = setTimeout(() => {
      fetch(`/api/search?q=${query}`)
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) setResults(data);
        })
        .catch(console.error);
    }, 300)
    
    return () => clearTimeout(timer)
  }, [query])

  return (
    <div className="flex flex-col items-center pt-10">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mb-16">
        <h1 className="text-6xl font-extrabold tracking-tight mb-6 text-white">
          The Package Manager for Fin.
        </h1>
        <p className="text-xl text-gray-400 mb-10 leading-relaxed">
          Fast, secure, and distributed. <br/>
          Build the future of software with the Finn ecosystem.
        </p>
        
        <div className="flex gap-4 justify-center items-center">
          <Link to="/docs" className="bg-white text-black px-8 py-3 rounded-lg font-semibold transition flex items-center gap-2">
            Get Started <ArrowRight size={18} />
          </Link>
          <div className="bg-zinc-800 border border-zinc-700 px-6 py-3 rounded-lg font-mono text-sm text-gray-300 flex items-center gap-3 select-all cursor-pointer hover:border-zinc-600 transition">
            <span className="text-green-400">$</span> curl -fsSL https://finn-lang.org/install.sh | sh
            <Download size={14} className="text-gray-500" />
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="flex justify-center gap-12 mt-10">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{stats.packages.toLocaleString()}</div>
              <div className="text-sm text-gray-400 flex items-center gap-1 justify-center mt-1">
                <Package size={14} /> Packages
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{stats.downloads.toLocaleString()}</div>
              <div className="text-sm text-gray-400 flex items-center gap-1 justify-center mt-1">
                <TrendingUp size={14} /> Downloads
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{stats.users.toLocaleString()}</div>
              <div className="text-sm text-gray-400 flex items-center gap-1 justify-center mt-1">
                <Users size={14} /> Publishers
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="w-full max-w-2xl relative z-10">
        <div className="relative">
          <div className="bg-zinc-900 rounded-lg flex items-center px-6 border border-zinc-700 focus-within:border-zinc-600 transition">
            <Search className="text-gray-500" size={24} />
            <input 
              type="text" 
              className="w-full bg-transparent border-none focus:ring-0 text-white p-5 text-lg placeholder:text-gray-600 outline-none"
              placeholder="Search packages..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Search Results Dropdown */}
        {results.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-4 bg-zinc-900 border border-zinc-700 rounded-lg overflow-hidden">
            {results.map((pkg) => (
              <Link key={pkg.name} to={`/packages/${pkg.name}`} className="flex items-center gap-4 p-4 hover:bg-white/5 transition border-b border-zinc-800/50 last:border-0 group">
                <div className="w-10 h-10 bg-zinc-700 rounded flex items-center justify-center text-white">
                  <Package size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white text-lg">{pkg.name}</span>
                    <span className="text-xs text-gray-500 font-mono bg-black/50 px-2 py-1 rounded">
                      {pkg.downloads} downloads
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1 truncate">{pkg.description}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
