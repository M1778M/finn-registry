# Finn Registry

The official package registry for the Fin programming language. A modern, fast, and secure platform for discovering, publishing, and managing Fin packages.

## Features

- Fast and modern web application built with React, TypeScript, and Cloudflare Workers
- Secure authentication using GitHub OAuth with session management
- Complete package management with CRUD operations for Fin packages
- Server-side parsing and validation of finn.toml manifest files
- Automatic README fetching and caching from GitHub repositories
- Download statistics and analytics tracking
- Modern dark theme interface with smooth animations
- Full-text search with filtering capabilities
- Comprehensive test suite with 68+ tests

## Architecture

- Frontend: React + Vite + TypeScript + Tailwind CSS
- Backend: Hono framework on Cloudflare Workers
- Database: Cloudflare D1 (SQLite)
- Authentication: GitHub OAuth with httpOnly cookies
- Deployment: Cloudflare Pages with GitHub integration

## Quick Start

### Prerequisites

- Node.js 20+
- GitHub account for OAuth authentication
- Cloudflare account

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/M1778M/finn-registry.git
   cd finn-registry
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your GitHub OAuth credentials
   ```

4. Set up the database:
   ```bash
   npm run db:migrate
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Optional: Add test data for development:
   ```bash
   npx wrangler d1 execute finn-db --file=./test-data.sql --local
   ```

### GitHub OAuth Setup

1. Create a GitHub OAuth App at https://github.com/settings/developers
2. Set Homepage URL to your domain (e.g., https://your-registry.com)
3. Set Authorization callback URL to https://your-registry.com/api/auth/callback
4. Add the Client ID and Secret to Cloudflare:
   ```bash
   wrangler secret put GITHUB_CLIENT_ID
   wrangler secret put GITHUB_CLIENT_SECRET
   ```

## Deployment

### Frontend (Cloudflare Pages)

1. Connect this GitHub repository to Cloudflare Pages
2. Set project name to `registry`
3. Configure build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/`

### Backend (Cloudflare Workers)

1. Go to Cloudflare Workers dashboard
2. Create a new Worker
3. Copy the built worker code from `dist/worker.js`
4. Set environment variables:
   - `GITHUB_CLIENT_ID` - Your GitHub OAuth client ID
   - `GITHUB_CLIENT_SECRET` - Your GitHub OAuth client secret
   - `APP_URL` - Your registry URL (e.g., https://registry.fin-lang.workers.dev)
   - `finn_db` - Your D1 database ID
5. Configure routing to proxy API calls (`/api/*`) to your worker

## Package Publishing

### For Package Authors

1. Create a `finn.toml` manifest file in your repository:
   ```toml
   [project]
   name = "my_package"
   version = "1.0.0"
   entrypoint = "lib.fin"
   description = "A useful Fin package"
   repository = "https://github.com/username/my_package"
   license = "MIT"

   [packages]
   std = "std"
   ```

2. Publish via the web interface:
   - Sign in with GitHub
   - Go to Account → Publish Version
   - Upload your finn.toml file
   - Add version details and changelog

### Package Requirements

- Name: Lowercase alphanumeric characters with underscores and dashes
- Version: Strict semantic versioning (X.Y.Z format)
- Entrypoint: Either `lib.fin` (library) or `main.fin` (binary)
- Repository: Must be a valid GitHub repository URL
- README: Optional but recommended in the repository root

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Type checking
npm run typecheck

# Linting
npm run lint
```

## API Endpoints

### Authentication
- `GET /api/auth/github` - Initiate GitHub OAuth flow
- `GET /api/auth/callback` - Handle OAuth callback
- `GET /api/auth/me` - Get current user information
- `POST /api/auth/logout` - Log out current user
- `POST /api/auth/token/regenerate` - Regenerate API token

### Packages
- `GET /api/packages` - List all packages
- `GET /api/packages/:name` - Get package details
- `POST /api/packages` - Create new package
- `POST /api/packages/:name/versions` - Publish new version
- `DELETE /api/packages/:name` - Delete package

### Search and Discovery
- `GET /api/search` - Search packages
- `GET /api/stats` - Get registry statistics

### Documentation
- `GET /api/packages/:name/readme` - Get package README
- `GET /api/users/:username` - Get user profile

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Fin Programming Language
- Cloudflare Workers
- Hono Framework
- React
