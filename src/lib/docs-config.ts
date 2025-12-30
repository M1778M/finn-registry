export interface DocSection {
  title: string;
  items: DocItem[];
}

export interface DocItem {
  title: string;
  slug: string;
  content: string;
  description?: string;
}

export const DOCS_CONFIG: DocSection[] = [
  {
    title: "Getting Started",
    items: [
      {
        title: "Introduction",
        slug: "introduction",
        description: "What is Finn Registry and why should you use it?",
        content: `
# Introduction

Finn Registry is the official package manager and distribution platform for the Finn programming language. It is designed to be high-performance, secure, and distributed by default.

:::info
Finn Registry is currently in alpha. We appreciate your feedback and contributions!
:::

## Key Features

- **Blazing Fast**: Built on top of high-performance edge infrastructure.
- **Secure**: All packages are cryptographically signed and verified.
- **Distributed**: Packages are cached globally for minimum latency.
- **Developer First**: Simple CLI and intuitive API.

## How it Works

The registry acts as a central hub where developers can publish their Finn modules. The Finn CLI interacts with the registry to resolve dependencies, download packages, and manage local project environments.

:::tip
Check out the [Installation](/docs/installation) guide to get started.
:::
        `
      },
      {
        title: "Installation",
        slug: "installation",
        description: "How to install the Finn CLI on your machine.",
        content: `
# Installation

To start using Finn Registry, you first need to install the Finn CLI tool.

## Using Curl (Linux & macOS)

Run the following command in your terminal:

\`\`\`bash
curl -fsSL https://finn.sh/install | sh
\`\`\`

## Using PowerShell (Windows)

Open PowerShell as Administrator and run:

\`\`\`powershell
irm https://finn.sh/install.ps1 | iex
\`\`\`

:::warning
Ensure your execution policy allows running scripts. You can set it using \`Set-ExecutionPolicy RemoteSigned -Scope CurrentUser\`.
:::

## Verifying Installation

After installation, verify that the CLI is working by checking the version:

\`\`\`bash
finn --version
\`\`\`
        `
      }
    ]
  },
  {
    title: "CLI Reference",
    items: [
      {
        title: "finn init",
        slug: "cli/init",
        description: "Initialize a new Finn project.",
        content: `
# finn init

Initialize a new Finn project in the current directory.

## Usage

\`\`\`bash
finn init [project-name]
\`\`\`

## Options

| Option | Description |
| :--- | :--- |
| \`--template <name>\` | Use a specific project template. |
| \`--git\` | Initialize a git repository. |
| \`--force\` | Overwrite existing files. |

## Examples

Initialize a basic project:
\`\`\`bash
finn init my-app
\`\`\`

Initialize with a web template:
\`\`\`bash
finn init my-web-app --template web
\`\`\`
        `
      },
      {
        title: "finn add",
        slug: "cli/add",
        description: "Add dependencies to your project.",
        content: `
# finn add

Add a new dependency to your Finn project.

## Usage

\`\`\`bash
finn add <package-name>[@version]
\`\`\`

## Example

\`\`\`bash
finn add http
finn add json@1.2.0
\`\`\`

:::info
Versions follow Semantic Versioning (SemVer) rules. If no version is specified, the latest stable version will be installed.
:::
        `
      }
    ]
  },
    {
      title: "Guides",
      items: [
        {
          title: "Project Setup",
          slug: "guides/setup",
          description: "Initialize and configure your first Finn project.",
          content: `
# Project Setup

Getting started with a new Finn project is quick and intuitive.

## Initialization

To create a new project, use the \`init\` command:

\`\`\`bash
finn init my-project
\`\`\`

This creates a directory named \`my-project\` with the following structure:

\`\`\`text
my-project/
├── finn.toml      # Project configuration
├── src/           # Source files
│   └── main.fn    # Entry point
└── .gitignore     # Git ignore rules
\`\`\`

## Configuration (finn.toml)

The \`finn.toml\` file is the heart of your project. It defines your package metadata and dependencies.

\`\`\`toml
[package]
  name = "finn/my-project"
  version = "0.1.0"
  description = "A brief description of my project"
  authors = ["Your Name <you@example.com>"]
  license = "MIT"
  
  [dependencies]
  "finn/http" = "1.0.0"
  "finn/json" = ">=1.2.0"
  \`\`\`
  
  :::important
  Package names must follow the format \`owner/name\` (e.g., \`finn/http\`). When publishing, the \`owner\` part must match your authenticated GitHub username.
  :::

          `
        },
        {
          title: "Publishing Packages",
          slug: "guides/publishing",
          description: "Learn how to publish your own packages to the registry.",
          content: `
# Publishing Packages

Sharing your code with the world is easy with Finn Registry.

## Prerequisites

1. A GitHub account for authentication.
2. A valid \`finn.toml\` file with a unique package name.
3. A README.md file (recommended).

## Steps to Publish

1. **Login**: Authenticate your CLI.
   \`\`\`bash
   finn login
   \`\`\`

2. **Verify**: Ensure your package is valid.
   \`\`\`bash
   finn verify
   \`\`\`

3. **Publish**: Push your package to the registry.
   \`\`\`bash
   finn publish
   \`\`\`

:::important
Once a version is published, it is **immutable**. You cannot delete or modify a version once it has been distributed. This ensures that projects depending on your code will always have reproducible builds.
:::
          `
        },
        {
          title: "CI/CD Integration",
          slug: "guides/ci-cd",
          description: "Automate your package publishing with CI/CD pipelines.",
          content: `
# CI/CD Integration

Automating your publishing workflow ensures consistency and reliability.

## Using GitHub Actions

You can use GitHub Actions to automatically publish new versions when you push a git tag.

### 1. Get an API Token

First, generate a token by running \`finn login\` locally and copying the token from your config file, or use the web dashboard to generate a CI token.

### 2. Add Secret to GitHub

Add your token to your GitHub repository secrets as \`FINN_TOKEN\`.

### 3. Create Workflow

Create \`.github/workflows/publish.yml\`:

\`\`\`yaml
name: Publish Package
on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install Finn
        run: curl -fsSL https://finn.sh/install | sh
      - name: Publish
        run: finn publish
        env:
          FINN_TOKEN: \${{ secrets.FINN_TOKEN }}
\`\`\`

:::info
The \`finn publish\` command will automatically detect the version from your \`finn.toml\` file.
:::
          `
        }
      ]
    },
    {
      title: "Security",
      items: [
        {
          title: "Overview",
          slug: "security/overview",
          description: "Our commitment to a secure package ecosystem.",
          content: `
# Security Overview

The Finn Registry implements multiple layers of security to protect developers and users from malicious code and unauthorized access.

## Core Security Features

- **Rate Limiting**: Protects our infrastructure and your account from abuse.
- **Cryptographic Verification**: Ensures package integrity using SHA-256 checksums.
- **Secure Authorization**: Strict ownership rules and fine-grained access control.
- **Robust Validation**: Enforced standards for package metadata and versions.

:::info
We take security seriously. If you find a vulnerability, please report it to security@finn.sh.
:::
          `
        },
        {
          title: "API Keys & Auth",
          slug: "security/auth",
          description: "Managing API keys and understanding authentication.",
          content: `
# API Keys & Authentication

The registry supports two primary methods of authentication:

## 1. JWT Tokens (Dashboard)
When you log in through the web dashboard, a short-lived JSON Web Token (JWT) is generated. This is ideal for browser-based operations.

## 2. API Keys (CLI & CI/CD)
For automated environments, you should use **Long-lived API Keys**. These keys start with the prefix \`fn_\` and are cryptographically hashed using \`scrypt\` before storage.

### Generating an API Key
You can generate a new API key via the CLI:
\`\`\`bash
finn key generate
\`\`\`
Or by calling the API:
\`\`\`bash
POST /api/me/api-key
\`\`\`

:::important
Your API key is only shown **once**. If you lose it, you must generate a new one and revoke the old one.
:::
          `
        },
        {
          title: "Package Integrity",
          slug: "security/integrity",
          description: "How we ensure packages are not tampered with.",
          content: `
# Package Integrity

Every version published to the Finn Registry is accompanied by a SHA-256 checksum.

## Checksum Verification
When you publish a package, the CLI calculates a checksum of the contents. The registry re-calculates this on receipt and verifies they match.

## Download Verification
When \`finn add\` downloads a package, it verifies the downloaded file against the checksum stored in the registry.

\`\`\`bash
# Example verification log
✔ Verifying checksum for http@1.2.4...
✔ Checksum match: 8f3a...b2e1
\`\`\`

:::tip
Verified packages are marked with a shield icon (🛡️) in the registry UI.
:::
          `
        },
        {
          title: "Rate Limiting",
          slug: "security/rate-limiting",
          description: "Limits and quotas for the API.",
          content: `
# Rate Limiting

To prevent abuse, we enforce the following rate limits:

| Endpoint | Limit | Window |
| :--- | :--- | :--- |
| Global API | 100 requests | 15 minutes |
| /api/publish | 5 requests | 1 minute |
| /api/me/api-key | 3 requests | 1 hour |

## Headers
The registry returns rate limit information in the response headers:
- \`X-RateLimit-Limit\`: Total requests allowed in the window.
- \`X-RateLimit-Remaining\`: Requests remaining in the current window.
- \`X-RateLimit-Reset\`: UTC timestamp when the limit resets.
          `
        }
      ]
    },
    {
      title: "API Reference",
      items: [
        {
          title: "Overview",
          slug: "api/overview",
          description: "General information about the Finn Registry API.",
          content: `
# API Overview

The Finn Registry provides a RESTful API for interacting with the package ecosystem programmatically.

## Base URL

All API requests should be made to:

\`\`\`text
https://registry.finn.sh/api
\`\`\`

## Content Type

The API accepts and returns data in JSON format. Ensure you include the appropriate headers in your requests:

\`\`\`text
Content-Type: application/json
Accept: application/json
\`\`\`

## Rate Limiting

To ensure stability, the API is rate-limited.
- **Unauthenticated**: 60 requests per hour.
- **Authenticated**: 5000 requests per hour.

:::warning
Exceeding rate limits will return a \`429 Too Many Requests\` status code.
:::
          `
        },
        {
          title: "Authentication",
          slug: "api/authentication",
          description: "How to authenticate your API requests.",
          content: `
# API Authentication

Many endpoints require authentication, especially those that modify data.

## JWT Tokens

Finn Registry uses JSON Web Tokens (JWT) for authentication. You can obtain a token via the CLI (\`finn login\`) or the web dashboard.

## Authorization Header

Include your token in the \`Authorization\` header of your requests:

\`\`\`text
Authorization: Bearer <your_token>
\`\`\`

## Example Request

\`\`\`bash
curl -H "Authorization: Bearer my_secret_token" \\
     https://registry.finn.sh/api/me
\`\`\`

:::important
Keep your tokens secret. Never commit tokens to version control.
:::
          `
        },
        {
          title: "Packages API",
          slug: "api/packages",
          description: "Endpoints for searching and retrieving package information.",
          content: `
# Packages API

Endpoints to interact with the package database.

## List/Search Packages

Retrieve a list of packages or search for specific ones.

**Endpoint**: \`GET /packages\`

| Parameter | Type | Description |
| :--- | :--- | :--- |
| \`q\` | string | Search query for name or description. |
| \`category\` | string | Filter by category. |
| \`sort\` | string | Sort by \`downloads\`, \`recent\`, or \`stars\`. |

**Example**:
\`\`\`bash
curl https://registry.finn.sh/api/packages?q=http&sort=recent
\`\`\`

## Get Package Details

Retrieve detailed information about a specific package and its versions.

  **Endpoint**: \`GET /package/:owner/:name\`
  
  **Example**:
  \`\`\`bash
  curl https://registry.finn.sh/api/package/finn/http
  \`\`\`
  
  **Response**:
  \`\`\`json
  {
    "id": "...",
    "name": "finn/http",
    "description": "High performance HTTP client",
    "owner": { "login": "finn" },
    "versions": [
      { "version": "1.2.4", "createdAt": "..." },
      { "version": "1.2.3", "createdAt": "..." }
    ]
  }
  \`\`\`

          `
        },
        {
          title: "Publishing API",
          slug: "api/publish",
          description: "Endpoints for publishing new packages and versions.",
          content: `
# Publishing API

Endpoints to publish and manage your packages.

## Publish Version

Publish a new version of a package. This endpoint will create the package if it doesn't exist.

**Endpoint**: \`POST /publish\`
**Auth**: Required

**Request Body**:
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| \`name\` | string | Yes | Unique package name. |
| \`version\` | string | Yes | SemVer version string. |
| \`description\` | string | No | Package description. |
| \`readmeContent\` | string | No | Markdown content for README. |
| \`repoUrl\` | string | No | URL to source repository. |

**Example**:
\`\`\`bash
curl -X POST https://registry.finn.sh/api/publish \\
     -H "Authorization: Bearer <token>" \\
     -d '{
       "name": "my-pkg",
       "version": "1.0.0",
       "description": "Awesome package"
     }'
\`\`\`

:::info
The authenticated user must be the owner of the package to publish new versions.
:::
          `
        }
      ]
    }
  ];

export function getDocBySlug(slug: string): DocItem | undefined {
  for (const section of DOCS_CONFIG) {
    const item = section.items.find(i => i.slug === slug);
    if (item) return item;
  }
  return undefined;
}
