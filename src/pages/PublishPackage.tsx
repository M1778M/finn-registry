import { useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Package, AlertCircle, CheckCircle, Loader, ArrowLeft, Github, Globe, Tag, FileText, LayoutList } from 'lucide-react'

export default function PublishPackage() {
  const { isAuthenticated, isLoading } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    repo_url: '',
    homepage: '',
    keywords: '',
    license: 'MIT',
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Redirect to login if not authenticated
  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  const validatePackageName = (name: string): boolean => {
    return /^[a-z][a-z0-9-]*$/.test(name) && name.length > 0
  }

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError(null)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!validatePackageName(formData.name)) {
      setError('Package name must start with lowercase letter and contain only lowercase letters, numbers, and hyphens.')
      return
    }

    if (!formData.description.trim()) {
      setError('Description is required.')
      return
    }

    if (!validateUrl(formData.repo_url)) {
      setError('Repository URL must be a valid URL.')
      return
    }

    if (formData.homepage && !validateUrl(formData.homepage)) {
      setError('Homepage must be a valid URL.')
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch('/api/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          repo_url: formData.repo_url,
          homepage: formData.homepage || null,
          keywords: formData.keywords ? formData.keywords.split(',').map(k => k.trim()).filter(Boolean) : [],
          license: formData.license,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to publish package')
      }

      const data = await response.json()
      setSuccess(true)
      setFormData({ name: '', description: '', repo_url: '', homepage: '', keywords: '', license: 'MIT' })

      // Redirect after 2 seconds
      setTimeout(() => {
        window.location.href = `/packages/${data.name}`
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <a href="/account" className="p-2 hover:bg-zinc-800 rounded-lg transition text-zinc-400 hover:text-white">
          <ArrowLeft size={20} />
        </a>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400">
              <Package size={24} />
            </div>
            Publish a Package
          </h1>
          <p className="text-zinc-400 mt-1">Share your package with the Finn community</p>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-start gap-3">
          <CheckCircle size={20} className="text-green-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-green-400 font-bold">Package published successfully!</p>
            <p className="text-green-400/80 text-sm">Redirecting to your package page...</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
          <AlertCircle size={20} className="text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-red-400 font-bold">Error</p>
            <p className="text-red-400/80 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-8">
        {/* Package Name */}
        <div>
          <label className="block text-sm font-bold text-zinc-300 mb-3">
            <div className="flex items-center gap-2 mb-2">
              <Tag size={16} className="text-indigo-400" />
              Package Name
            </div>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={submitting}
            placeholder="e.g., my-awesome-package"
            className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition disabled:opacity-50"
            required
          />
          <p className="text-xs text-zinc-500 mt-2">
            Lowercase letters, numbers, and hyphens only. Must start with a letter.
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-bold text-zinc-300 mb-3">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={16} className="text-indigo-400" />
              Description
            </div>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            disabled={submitting}
            placeholder="Brief description of your package"
            rows={4}
            className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition disabled:opacity-50 resize-none"
            required
          />
          <p className="text-xs text-zinc-500 mt-2">
            {formData.description.length}/200 characters
          </p>
        </div>

        {/* Repository URL */}
        <div>
          <label className="block text-sm font-bold text-zinc-300 mb-3">
            <div className="flex items-center gap-2 mb-2">
              <Github size={16} className="text-indigo-400" />
              Repository URL
            </div>
          </label>
          <input
            type="url"
            name="repo_url"
            value={formData.repo_url}
            onChange={handleChange}
            disabled={submitting}
            placeholder="https://github.com/username/repo"
            className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition disabled:opacity-50"
            required
          />
          <p className="text-xs text-zinc-500 mt-2">
            Your GitHub repository URL (or other git hosting)
          </p>
        </div>

        {/* Homepage URL (Optional) */}
        <div>
          <label className="block text-sm font-bold text-zinc-300 mb-3">
            <div className="flex items-center gap-2 mb-2">
              <Globe size={16} className="text-indigo-400" />
              Homepage URL
            </div>
          </label>
          <input
            type="url"
            name="homepage"
            value={formData.homepage}
            onChange={handleChange}
            disabled={submitting}
            placeholder="https://example.com (optional)"
            className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition disabled:opacity-50"
          />
          <p className="text-xs text-zinc-500 mt-2">
            Optional: Your project's official website
          </p>
        </div>

        {/* Keywords */}
        <div>
          <label className="block text-sm font-bold text-zinc-300 mb-3">
            <div className="flex items-center gap-2 mb-2">
              <Tag size={16} className="text-indigo-400" />
              Keywords
            </div>
          </label>
          <input
            type="text"
            name="keywords"
            value={formData.keywords}
            onChange={handleChange}
            disabled={submitting}
            placeholder="e.g., http, networking, async"
            className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition disabled:opacity-50"
          />
          <p className="text-xs text-zinc-500 mt-2">
            Comma-separated keywords to help users discover your package
          </p>
        </div>

        {/* License */}
        <div>
          <label className="block text-sm font-bold text-zinc-300 mb-3">
            <div className="flex items-center gap-2 mb-2">
              <LayoutList size={16} className="text-indigo-400" />
              License
            </div>
          </label>
          <select
            name="license"
            value={formData.license}
            onChange={handleChange}
            disabled={submitting}
            className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition disabled:opacity-50"
          >
            <option>MIT</option>
            <option>Apache-2.0</option>
            <option>GPL-3.0</option>
            <option>BSD-3-Clause</option>
            <option>ISC</option>
          </select>
          <p className="text-xs text-zinc-500 mt-2">
            Choose an open source license for your package
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting || success}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <Loader size={18} className="animate-spin" />
              Publishing...
            </>
          ) : (
            <>
              <Package size={18} />
              Publish Package
            </>
          )}
        </button>
      </form>

      {/* Info Box */}
      <div className="mt-8 bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-6">
        <h3 className="font-bold text-indigo-400 mb-3">Before you publish</h3>
        <ul className="space-y-2 text-sm text-indigo-300/80">
          <li>✓ Make sure your repository is publicly accessible</li>
          <li>✓ Include a README.md in your repository</li>
          <li>✓ Add a finn.toml file with package metadata</li>
          <li>✓ Tag your releases in Git for versioning</li>
          <li>✓ Read our <a href="/docs" className="text-indigo-400 hover:underline">publishing guidelines</a></li>
        </ul>
      </div>
    </div>
  )
}
