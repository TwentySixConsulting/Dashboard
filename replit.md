# TwentySix Pay & Benefits Dashboard

## Overview

This is a salary benchmarking and market insights dashboard built for HR professionals and organizations. The application provides personalized pay analysis, market comparisons, benefits breakdowns, and strategic recommendations for reward planning.

The dashboard displays market data for job roles, comparing actual salaries against market quartiles (lower quartile, median, upper quartile), identifies pay positioning strengths and risks, and provides guidance on benefits trends and next steps for compensation planning.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for development and production builds
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state and caching
- **Styling**: Tailwind CSS v4 with CSS variables for theming
- **UI Components**: shadcn/ui component library (New York style) built on Radix UI primitives
- **Charts**: Recharts for data visualization
- **Fonts**: Plus Jakarta Sans (body) and Space Grotesk (display headings)

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **Build**: esbuild for server bundling, Vite for client
- **Static Serving**: Express serves built client assets in production

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` contains database table definitions
- **Migrations**: Drizzle Kit manages migrations in `/migrations` directory
- **Optional CMS**: Supabase integration for content management (dashboard sections, page metadata)

### Project Structure
```
├── client/src/          # React frontend
│   ├── components/      # UI components (shadcn/ui in ui/)
│   ├── pages/           # Route page components
│   ├── lib/             # Utilities, data, API clients
│   └── hooks/           # Custom React hooks
├── server/              # Express backend
│   ├── index.ts         # Server entry point
│   ├── routes.ts        # API route definitions
│   └── storage.ts       # Data storage interface
├── shared/              # Shared code (schema, types)
└── migrations/          # Database migrations
```

### Key Design Patterns
- **Path Aliases**: `@/` maps to client/src, `@shared/` maps to shared/
- **Component Architecture**: Page components in `/pages`, reusable UI in `/components`
- **Data Fetching**: Static data in `lib/data.ts`, CMS data via Supabase client
- **Export Features**: html-to-image for exporting charts as PNG images

## External Dependencies

### Database
- **PostgreSQL**: Primary database via `DATABASE_URL` environment variable
- **Drizzle ORM**: Schema management and query building

### Optional Integrations
- **Supabase**: Content management for dashboard sections and page metadata
  - Requires `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` environment variables
  - Falls back to default static content when not configured

### Key NPM Packages
- **UI**: @radix-ui/* primitives, lucide-react icons, recharts, class-variance-authority
- **Data**: @tanstack/react-query, drizzle-orm, @supabase/supabase-js
- **Utilities**: date-fns, zod for validation, html-to-image for exports
- **Drag & Drop**: @dnd-kit for admin section reordering

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (required for database features)
- `VITE_SUPABASE_URL`: Supabase project URL (optional)
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key (optional)