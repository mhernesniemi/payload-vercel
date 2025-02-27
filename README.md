# Payload CMS Starter Template

This is a starter template for building web applications with Payload CMS and SQLite database, powered by Next.js 15 and React 19.

## ✨ Features

- **Database**: SQLite with @libsql/client
- **CMS**: Payload CMS v3
- **Runtime**: Node.js (^18.20.2 || >=20.9.0)
- **Framework**: Next.js 15 with Turbopack
- **Search**: Elasticsearch integration with Searchkit
- **UI**:
  - Tailwind CSS
  - Headless UI components
  - Hero Icons
  - Motion for animations
  - Sonner for notifications
- **Internationalization**: next-intl
- **SSO Authentication**: NextAuth.js
- **SEO**: Payload CMS SEO plugin
- **Rich Text Editor**: Payload CMS Lexical editor

## 🛠️ Installation

1. Clone the repository

2. Start Elasticsearch container:

```bash
docker compose up -d elasticsearch
```

This will start Elasticsearch on port 9200. You can verify it's running with:

```bash
curl http://localhost:9200
```

3. Install dependencies:

```bash
pnpm i
```

4. Start the development environment:

```bash
pnpm dev
```

## 📜 Available Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm devsafe` - Start development server with clean .next directory
- `pnpm build` - Build the application
- `pnpm start` - Start production server
- `pnpm generate:types` - Generate Payload CMS types
- `pnpm generate:importmap` - Generate import map
- `pnpm reindex` - Reindex data to Elasticsearch
- `pnpm seed` - Run database seeding script

## 🔐 Environment Variables

Copy the `.env.example` file as `.env` and fill in the required variables.

## 📁 Project Structure

```
src/
├── app/              # Next.js app directory
├── blocks/           # Payload CMS block components
├── collections/      # Payload CMS collections
├── components/       # React components
├── fields/          # Custom Payload CMS fields
├── globals/         # Payload CMS single use collections
├── i18n/            # Internationalization configs
├── lib/             # Utility functions and shared code
├── messages/        # Translation messages
├── migrations/      # Database migrations
├── scripts/         # Utility scripts (seeding, reindexing)
├── types/           # TypeScript type definitions
├── middleware.ts    # Next.js middleware
└── payload.config.ts # Payload CMS configuration
```

## 📚 Style Guide

For detailed coding standards and naming conventions, please refer to our [Style Guide](./STYLEGUIDE.md).

## 👩‍💻 Development

The project uses several development tools:

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Husky for Git hooks
- lint-staged for pre-commit checks

## 🐳 Docker Services

### Elasticsearch

- Version: 7.17.18
- Port: 9200
- Memory: 512MB (min) - 512MB (max)
- Security: Disabled for development
- Data persistence: Volume mounted at `/usr/share/elasticsearch/data`
