# Payload CMS Starter Template

This is a starter template for building web applications with Payload CMS and SQLite database, powered by Next.js 15 and React 19.

## ✨ Features

- **Database**: SQLite with @libsql/client
- **CMS**: Payload CMS v3
- **Runtime**: Node.js (^18.20.2 || >=20.9.0)
- **Framework**: Next.js 15 with Turbopack
- **Search**: Algolia integration with InstantSearch
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

1. Clone this repository

2. Copy the `.env.example` file as `.env` and fill in the required variables

```bash
cp .env.example .env
```

3. Install dependencies:

```bash
pnpm i
```

4. Start the development environment:

```bash
pnpm dev
```

5. Open the admin UI at http://localhost:3000/admin or the website at http://localhost:3000

## 📜 Available Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm devsafe` - Start development server with clean .next directory
- `pnpm build` - Build the application
- `pnpm start` - Start production server
- `pnpm generate:types` - Generate Payload CMS types
- `pnpm generate:importmap` - Generate import map
- `pnpm reindex` - Reindex data to Algolia
- `pnpm seed` - Run database seeding script
- `pnpm format` - Format all files with Prettier

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

## 🔍 Search

### Algolia

The project uses Algolia for search functionality:

- **Index naming**: `global_fi` and `global_en` for different languages
- **Auto-indexing**: Documents are automatically indexed when created/updated via Payload hooks
- **Configuration**: Set up your Algolia credentials in environment variables (don't use production credentials in development)
