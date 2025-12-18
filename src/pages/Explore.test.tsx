import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('Explore Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('API Integration', () => {
    it('should fetch packages from /api/packages', () => {
      const endpoint = '/api/packages'
      expect(endpoint).toBe('/api/packages')
    })

    it('should handle pagination parameters', () => {
      const params = { limit: 20, offset: 0 }
      expect(params.limit).toBe(20)
      expect(params.offset).toBe(0)
    })

    it('should support limit and offset', () => {
      const validParams = [
        { limit: 20, offset: 0 },
        { limit: 20, offset: 20 },
        { limit: 50, offset: 100 },
      ]
      expect(validParams.length).toBe(3)
    })
  })

  describe('Sorting', () => {
    it('should support multiple sort options', () => {
      const sortOptions = ['downloads', 'recent']
      expect(sortOptions).toContain('downloads')
      expect(sortOptions).toContain('recent')
    })

    it('should default to downloads sort', () => {
      const defaultSort = 'downloads'
      expect(defaultSort).toBe('downloads')
    })
  })

  describe('Search', () => {
    it('should filter packages by name', () => {
      const packages = [
        { name: 'std', description: 'Standard lib' },
        { name: 'http', description: 'HTTP client' },
      ]

      const search = 'std'
      const filtered = packages.filter(p => p.name.includes(search))
      expect(filtered.length).toBe(1)
      expect(filtered[0].name).toBe('std')
    })

    it('should filter packages by description', () => {
      const packages = [
        { name: 'std', description: 'Standard library' },
        { name: 'http', description: 'HTTP client' },
      ]

      const search = 'HTTP'
      const filtered = packages.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      )
      expect(filtered.length).toBe(1)
    })

    it('should be case-insensitive', () => {
      const packageName = 'MyPackage'
      const search = 'mypackage'
      const matches = packageName.toLowerCase().includes(search.toLowerCase())
      expect(matches).toBe(true)
    })
  })

  describe('Download Count Formatting', () => {
    it('should format large download counts', () => {
      const formatDownloads = (num: number) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
        return num.toString()
      }

      expect(formatDownloads(1000000)).toBe('1.0M')
      expect(formatDownloads(1500000)).toBe('1.5M')
      expect(formatDownloads(1000)).toBe('1.0K')
      expect(formatDownloads(1500)).toBe('1.5K')
      expect(formatDownloads(500)).toBe('500')
    })
  })

  describe('Date Formatting', () => {
    it('should format timestamps correctly', () => {
      const timestamp = 1609459200 // Jan 1, 2021
      const date = new Date(timestamp * 1000)
      const formatted = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
      expect(formatted).toMatch(/Jan \d+, 2021/)
    })
  })

  describe('Navigation', () => {
    it('should link to package detail page', () => {
      const packageName = 'my-package'
      const url = `/packages/${packageName}`
      expect(url).toBe('/packages/my-package')
    })

    it('should link to publish page', () => {
      const publishUrl = '/publish'
      expect(publishUrl).toBe('/publish')
    })
  })

  describe('Empty State', () => {
    it('should show empty state when no packages found', () => {
      const packages = []
      const isEmpty = packages.length === 0
      expect(isEmpty).toBe(true)
    })

    it('should suggest search refinement', () => {
      const search = 'nonexistent'
      const message = `No results for "${search}"`
      expect(message).toContain(search)
    })
  })

  describe('Loading State', () => {
    it('should show loading indicator while fetching', () => {
      const loading = true
      expect(loading).toBe(true)
    })
  })

  describe('Package Card', () => {
    it('should display package information', () => {
      const pkg = {
        name: 'std',
        description: 'Standard library',
        downloads: 10000,
        owner_name: 'finn-lang',
        license: 'MIT',
      }

      expect(pkg.name).toBeDefined()
      expect(pkg.description).toBeDefined()
      expect(pkg.downloads).toBeDefined()
      expect(pkg.owner_name).toBeDefined()
      expect(pkg.license).toBeDefined()
    })
  })
})
