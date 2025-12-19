import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, Download, Search, Filter, TrendingUp, Clock } from 'lucide-react'
import CustomDropdown from '../components/CustomDropdown'

interface PackageData {
  name: string
  description: string
  repo_url: string
  downloads: number
  created_at: number
}

type SortOption = 'downloads' | 'newest' | 'name'

export default function Explore() {
  const [packages, setPackages] = useState<PackageData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('downloads')

  useEffect(() => {
    fetch('/api/packages')
      .then(res => res.json())
      .then(data => {
        // Handle both array and object response formats
        if (Array.isArray(data)) {
          setPackages(data)
        } else if (data.packages && Array.isArray(data.packages)) {
          setPackages(data.packages)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filteredPackages = packages
    .filter(pkg => 
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'downloads':
          return b.downloads - a.downloads
        case 'newest':
          return b.created_at - a.created_at
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

  const formatDownloads = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
    return count.toString()
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-4">Explore Packages</h1>
        <p className="text-xl text-zinc-400">
          Discover and browse all packages in the Finn registry.
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
          <input
            type="text"
            placeholder="Search packages..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-zinc-600 focus:border-indigo-500/50 focus:outline-none transition"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-zinc-500" />
          <CustomDropdown
            options={[
              { value: 'downloads', label: 'Most Downloads' },
              { value: 'newest', label: 'Newest' },
              { value: 'name', label: 'Name (A-Z)' }
            ]}
            value={sortBy}
            onChange={(value) => setSortBy(value as SortOption)}
            className="flex-1"
          />
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex gap-6 mb-8 text-sm text-zinc-500">
        <span className="flex items-center gap-2">
          <Package size={16} />
          {packages.length} packages
        </span>
        <span className="flex items-center gap-2">
          <TrendingUp size={16} />
          {formatDownloads(packages.reduce((sum, pkg) => sum + pkg.downloads, 0))} total downloads
        </span>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredPackages.length === 0 && (
        <div className="text-center py-20">
          <Package size={48} className="mx-auto text-zinc-700 mb-4" />
          <h3 className="text-xl font-bold mb-2">No packages found</h3>
          <p className="text-zinc-500">
            {searchQuery ? `No results for "${searchQuery}"` : 'No packages available yet.'}
          </p>
        </div>
      )}

      {/* Package Grid */}
      {!loading && filteredPackages.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map(pkg => (
            <Link
              key={pkg.name}
              to={`/packages/${pkg.name}`}
              className="group bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-indigo-500/50 transition duration-300 hover:shadow-xl hover:shadow-indigo-500/5"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500/20 transition">
                  <Package size={24} />
                </div>
              </div>
              
              <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-400 transition">{pkg.name}</h3>
              <p className="text-zinc-400 text-sm mb-4 line-clamp-2">{pkg.description || 'No description available'}</p>
              
              <div className="flex items-center gap-4 text-xs text-zinc-500">
                <span className="flex items-center gap-1">
                  <Download size={14} />
                  {formatDownloads(pkg.downloads)}
                </span>
                {pkg.created_at && (
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {formatDate(pkg.created_at)}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Stats Footer */}
      {!loading && packages.length > 0 && (
        <div className="mt-8 text-center text-sm text-zinc-500">
          Total packages: {packages.length.toLocaleString()}
        </div>
      )}
    </div>
  )
}
