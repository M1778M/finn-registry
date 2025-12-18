import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { User, Package, Calendar, Download, ExternalLink, Github } from 'lucide-react'

interface UserPackage {
  name: string
  description: string
  downloads: number
  created_at: number
}

interface UserData {
  id: number
  username: string
  avatar_url: string | null
  created_at: number
  packages: UserPackage[]
}

export default function UserProfile() {
  const { username } = useParams()
  const [user, setUser] = useState<UserData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/users/${username}`)
      .then(res => {
        if (!res.ok) throw new Error('User not found')
        return res.json()
      })
      .then(setUser)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [username])

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const totalDownloads = user?.packages.reduce((sum, pkg) => sum + pkg.downloads, 0) || 0

  if (loading) {
    return (
      <div className="flex justify-center mt-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <User size={64} className="text-zinc-700 mb-4" />
        <h1 className="text-2xl font-bold mb-2">User Not Found</h1>
        <p className="text-zinc-500 mb-6">The user "{username}" doesn't exist.</p>
        <Link to="/packages" className="text-indigo-400 hover:underline">
          Browse packages →
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      {/* Profile Header */}
      <div className="flex items-start gap-6 mb-10">
        {user.avatar_url ? (
          <img 
            src={user.avatar_url} 
            alt={user.username}
            className="w-24 h-24 rounded-2xl shadow-lg"
          />
        ) : (
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-lg">
            {user.username.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2">{user.username}</h1>
          <div className="flex items-center gap-6 text-zinc-400">
            <span className="flex items-center gap-2">
              <Calendar size={16} />
              Joined {formatDate(user.created_at)}
            </span>
            <span className="flex items-center gap-2">
              <Package size={16} />
              {user.packages.length} packages
            </span>
            <span className="flex items-center gap-2">
              <Download size={16} />
              {totalDownloads.toLocaleString()} total downloads
            </span>
          </div>
        </div>
        <a 
          href={`https://github.com/${user.username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition text-zinc-300"
        >
          <Github size={18} />
          View on GitHub
        </a>
      </div>

      {/* Packages Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Package size={24} className="text-indigo-400" />
          Published Packages
        </h2>

        {user.packages.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">
            <Package size={48} className="mx-auto text-zinc-700 mb-4" />
            <p className="text-zinc-500">This user hasn't published any packages yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {user.packages.map(pkg => (
              <Link
                key={pkg.name}
                to={`/packages/${pkg.name}`}
                className="group bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-indigo-500/50 transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500/20 transition">
                    <Package size={24} />
                  </div>
                  <ExternalLink size={18} className="text-zinc-600 group-hover:text-indigo-400 transition" />
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-400 transition">{pkg.name}</h3>
                <p className="text-zinc-400 text-sm mb-4 line-clamp-2">{pkg.description || 'No description'}</p>
                <div className="flex items-center gap-4 text-xs text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Download size={14} />
                    {pkg.downloads.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {formatDate(pkg.created_at)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
