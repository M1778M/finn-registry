-- Finn Registry Database Schema

-- 1. Users
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    github_id INTEGER UNIQUE,
    avatar_url TEXT,
    email TEXT,
    api_token TEXT UNIQUE,
    created_at INTEGER DEFAULT (unixepoch())
);

-- 2. Sessions (for cookie-based auth)
CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    expires_at INTEGER NOT NULL,
    created_at INTEGER DEFAULT (unixepoch()),
    user_agent TEXT,
    ip_address TEXT,
    login_time INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Packages
CREATE TABLE IF NOT EXISTS packages (
    name TEXT PRIMARY KEY,
    description TEXT,
    repo_url TEXT NOT NULL,
    homepage TEXT,
    keywords TEXT, -- JSON array stored as text
    license TEXT DEFAULT 'MIT',
    owner_id INTEGER,
    downloads INTEGER DEFAULT 0,
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch()),
    FOREIGN KEY (owner_id) REFERENCES users(id)
);

-- 4. Versions
CREATE TABLE IF NOT EXISTS versions (
    package_name TEXT,
    version TEXT,
    commit_hash TEXT,
    changelog TEXT,
    created_at INTEGER DEFAULT (unixepoch()),
    PRIMARY KEY (package_name, version),
    FOREIGN KEY (package_name) REFERENCES packages(name) ON DELETE CASCADE
);

-- 5. Package Downloads (daily stats)
CREATE TABLE IF NOT EXISTS download_stats (
    package_name TEXT,
    date TEXT, -- YYYY-MM-DD format
    count INTEGER DEFAULT 0,
    PRIMARY KEY (package_name, date),
    FOREIGN KEY (package_name) REFERENCES packages(name) ON DELETE CASCADE
);

-- Cache for README files (Phase 2 requirement)
CREATE TABLE IF NOT EXISTS package_readme_cache (
    package_name TEXT PRIMARY KEY,
    content TEXT, -- The raw Markdown content
    updated_at INTEGER DEFAULT (unixepoch()), -- Check TTL against this
    FOREIGN KEY (package_name) REFERENCES packages(name) ON DELETE CASCADE
);

-- Daily Download Stats (Phase 2 requirement)
CREATE TABLE IF NOT EXISTS download_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    package_name TEXT,
    date TEXT, -- Format: YYYY-MM-DD
    count INTEGER DEFAULT 1,
    FOREIGN KEY (package_name) REFERENCES packages(name) ON DELETE CASCADE,
    UNIQUE(package_name, date) -- Upsert constraint
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_packages_owner_id ON packages(owner_id);
CREATE INDEX IF NOT EXISTS idx_packages_downloads ON packages(downloads DESC);
CREATE INDEX IF NOT EXISTS idx_versions_package ON versions(package_name);
CREATE INDEX IF NOT EXISTS idx_packages_name ON packages(name);
CREATE INDEX IF NOT EXISTS idx_versions_pkg_ver ON versions(package_name, version);
