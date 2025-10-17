# Cursor Commands Explorer

A community-driven platform for discovering, sharing, and mastering Cursor AI agent commands. Built with Next.js 15, Clerk authentication, and modern web technologies.

## Features

- 🔍 **Smart Search**: Find Cursor commands by name, description, or content with instant search
- 📚 **Category Organization**: Browse commands by categories like "Code Review", "Testing", "Documentation"
- ⭐ **Bookmarks & Favorites**: Save your most-used commands for quick access
- 📝 **Personal Notes**: Add your own context and usage notes to commands
- 🏷️ **Tag System**: Find commands by tech stack, framework, and specific goals
- 🚀 **One-Click Copy**: Copy commands instantly with detailed usage instructions
- 👥 **Community Driven**: Commands curated and tested by real Cursor power users
- 🎨 **Modern UI**: Clean, responsive interface with dark/light mode support

## Tech Stack

- **Framework**: Next.js 15 (App Router) with Turbopack
- **Authentication**: Clerk (User management & auth)
- **Database**: Neon Postgres (Serverless PostgreSQL)
- **ORM**: Drizzle ORM with TypeScript
- **UI**: Tailwind CSS v4 + Radix UI Components
- **Code Quality**: Ultracite (Biome-based linting & formatting)
- **Testing**: Playwright (E2E testing)
- **Analytics**: Vercel Analytics
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 20+ 
- pnpm package manager
- Neon Postgres database account
- Clerk account for authentication

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd cursor-commands-explorer
\`\`\`

2. Install dependencies:
\`\`\`bash
pnpm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

Then fill in your credentials in `.env.local`:
- `DATABASE_URL`: Your Neon Postgres connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key  
- `CLERK_SECRET_KEY`: Your Clerk secret key

4. Generate and push the database schema:
\`\`\`bash
pnpm db:push
\`\`\`

5. Seed the database with initial data:
\`\`\`bash
pnpm db:seed
\`\`\`

6. Start the development server:
\`\`\`bash
pnpm dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run Ultracite linter
- `pnpm lint:fix` - Fix code issues with Ultracite
- `pnpm db:generate` - Generate Drizzle migrations
- `pnpm db:migrate` - Run migrations
- `pnpm db:push` - Push schema to database (development)
- `pnpm db:studio` - Open Drizzle Studio
- `pnpm db:seed` - Seed database with initial data
- `pnpm test:e2e` - Run Playwright E2E tests (headless)

## Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── commands/      # Commands API
│   │   ├── bookmarks/     # Bookmarks API
│   │   ├── notes/         # Notes API
│   │   ├── reports/       # Reports API
│   │   └── export/        # Export API
│   ├── commands/          # Commands pages
│   ├── favorites/         # Favorites page
│   ├── sign-in/           # Clerk sign-in
│   └── sign-up/           # Clerk sign-up
├── components/            # React components
│   ├── ui/               # UI components (Radix)
│   ├── command-card.tsx  # Command card component
│   ├── command-filters.tsx
│   └── search-bar.tsx
├── db/                    # Database
│   ├── schema/           # Drizzle schemas
│   └── index.ts          # Database connection
├── hooks/                 # Custom React hooks
├── scripts/              # Utility scripts
│   └── seed.ts          # Database seeding
├── tests/                # E2E tests
└── middleware.ts         # Clerk middleware
\`\`\`

## Database Schema

### Core Tables

- **commands**: Cursor command definitions with content, status, and metadata
- **categories**: Command categories (e.g., "Code Review", "Testing", "Documentation")
- **command_tags**: Tags for organizing commands by tech stack and goals
- **command_tag_map**: Many-to-many relationship between commands and tags
- **bookmarks**: User-saved favorite commands
- **notes**: User notes attached to commands
- **reports**: User-submitted issue reports
- **user_profiles**: User profile data

## API Endpoints

### Commands
- `GET /api/commands` - List commands with search & filters
- `GET /api/commands/[slug]` - Get command details
- `POST /api/commands` - Submit new command (auth required)

### Bookmarks
- `GET /api/bookmarks` - Get user bookmarks (auth required)
- `POST /api/bookmarks` - Add bookmark (auth required)
- `DELETE /api/bookmarks` - Remove bookmark (auth required)

### Notes
- `GET /api/notes` - Get user notes (auth required)
- `POST /api/notes` - Create note (auth required)
- `PUT /api/notes` - Update note (auth required)
- `DELETE /api/notes` - Delete note (auth required)

### Reports
- `GET /api/reports` - List reports (auth required)
- `POST /api/reports` - Submit report

### Export
- `GET /api/export` - Export commands (JSON/CSV)

### Admin
- `GET /api/admin/commands` - Admin command management
- `POST /api/admin/commands` - Approve/reject commands

## Testing

Run E2E tests with Playwright:

\`\`\`bash
pnpm test:e2e
\`\`\`

Tests cover:
- Home page loading and hero section
- Navigation between pages
- Search functionality and command filtering
- Command detail views and copying
- User authentication flows
- Bookmark and favorites functionality

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables
4. Deploy

### Database Migrations

For production deployments, run migrations:

\`\`\`bash
pnpm db:migrate
\`\`\`

Then seed the database:

\`\`\`bash
pnpm db:seed
\`\`\`

## Contributing

Contributions are welcome! This project is community-driven and we'd love your help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following the Ultracite code quality standards
4. Run linting and tests:
   \`\`\`bash
   pnpm lint:fix
   pnpm test:e2e
   \`\`\`
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Adding New Commands

To add new Cursor commands to the platform:
1. Sign up and log in
2. Navigate to the "Submit Command" page
3. Fill in the command details, category, and tags
4. Submit for community review
5. Commands are reviewed and approved by moderators

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Open an issue on GitHub for bugs or feature requests
- Join our community discussions for help and sharing commands
- Check the documentation for common questions

## What is Cursor?

Cursor is an AI-powered code editor that helps developers write code faster and more efficiently. This platform provides a curated collection of proven commands that work with Cursor's AI agent, helping you get the most out of your development workflow.

---

**Built with ❤️ by the Cursor community**
