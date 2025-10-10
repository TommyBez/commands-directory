# Cursor Commands Explorer

A modern web application for discovering, searching, and mastering keyboard-driven commands. Built with Next.js, Clerk, Drizzle ORM, and Neon Postgres.

## Features

- 🔍 **Powerful Search**: Find commands by name, syntax, or description with advanced filtering
- 📚 **Category Browsing**: Organize commands by categories and tags
- ⭐ **Bookmarks**: Save your favorite commands for quick access
- 📝 **Personal Notes**: Add context and reminders to commands
- 🎯 **Multi-level Support**: Commands for beginners, intermediate, and advanced users
- 🖥️ **Cross-platform**: Filter by OS (Mac, Windows, Linux)
- 🚀 **Fast & Modern**: Built with Next.js 15 and React 19

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Authentication**: Clerk
- **Database**: Neon Postgres (Serverless)
- **ORM**: Drizzle ORM
- **UI**: Tailwind CSS + Radix UI Components
- **Testing**: Playwright (E2E)
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- Neon Postgres database
- Clerk account

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd commands-directory
\`\`\`

2. Install dependencies:
\`\`\`bash
pnpm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

Then fill in your credentials:
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
- `pnpm lint` - Run Biome linter
- `pnpm format` - Format code with Biome
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
│   ├── search-bar.tsx
│   └── onboarding-modal.tsx
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

- **commands**: Command definitions with syntax, description, OS, level, etc.
- **categories**: Command categories
- **command_tags**: Tags for organizing commands
- **command_tag_map**: Many-to-many relationship between commands and tags
- **bookmarks**: User-saved favorite commands
- **notes**: User notes attached to commands
- **reports**: User-submitted issue reports
- **user_profiles**: User preferences and onboarding state

## API Endpoints

### Commands
- `GET /api/commands` - List commands with search & filters
- `GET /api/commands/[slug]` - Get command details

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

## Testing

Run E2E tests with Playwright:

\`\`\`bash
pnpm test:e2e
\`\`\`

Tests cover:
- Home page loading
- Navigation between pages
- Search functionality
- Filtering commands
- Command detail views

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

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting and tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please open an issue on GitHub.
