# 🚀 Payload CMS Starter Template

This is a demo project showcasing how to use Payload CMS with SQLite database, built with Next.js 15 and React 19.

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
- **Authentication**: NextAuth.js
- **SEO**: Payload CMS SEO plugin
- **Rich Text Editor**: Payload CMS Lexical editor

## 🛠️ Installation

1. Clone the repository:

```bash
git clone [repository-url]
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the development environment:

```bash
npm run dev
# or
yarn dev
```

## 📜 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run devsafe` - Start development server with clean .next directory
- `npm run build` - Build the application
- `npm run start` - Start production server
- `npm run generate:types` - Generate Payload CMS types
- `npm run generate:importmap` - Generate import map
- `npm run reindex` - Reindex data to Elasticsearch
- `npm run seed` - Run database seeding script

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
├── globals/         # Payload CMS global configs
├── i18n/            # Internationalization configs
├── lib/             # Utility functions and shared code
├── messages/        # Translation messages
├── migrations/      # Database migrations
├── scripts/         # Utility scripts (seeding, reindexing)
├── types/           # TypeScript type definitions
├── middleware.ts    # Next.js middleware
└── payload.config.ts # Payload CMS configuration
```

## 👩‍💻 Development

The project uses several development tools:

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Husky for Git hooks
- lint-staged for pre-commit checks
