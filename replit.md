# Zigbert Pay & Benefits Dashboard

## Overview

This is a salary benchmarking and market insights dashboard built for HR professionals and organizations. The application provides personalized pay analysis, market comparisons, benefits breakdowns, and strategic recommendations for reward planning.

The dashboard displays market data for job roles, comparing actual salaries against market quartiles (lower quartile, median, upper quartile), identifies pay positioning strengths and risks, and provides guidance on benefits trends and next steps for compensation planning.

## Current Client
- **Organisation**: Brighton Demo Technologies
- **Industry**: SaaS / Technology
- **Location**: Brighton
- **Report Date**: February 2026 (Q1 2026)
- **Employees**: 15
- **Roles Assessed**: 10

## User Preferences

Preferred communication style: Simple, everyday language.

## Application Mode

The application has a **public landing page** with login/signup functionality. Unauthenticated users see the landing page with product overview and can either log in or create an account via a 3-step signup wizard (personal details, organisation details, role entry). Authenticated users are taken directly to the **client-facing dashboard** with salary benchmarking data.

### Authentication System
- **Backend**: Passport.js with local strategy, bcrypt password hashing, PostgreSQL session store (connect-pg-simple)
- **Frontend**: React Query-based auth hook (`useAuth`), AuthGate component in App.tsx
- **Signup flow**: 3 steps - personal info, org details, role template (online entry or CSV download)
- **Session**: Persistent via PostgreSQL, 30-day cookie expiry

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
- **CMS Backend**: Supabase for content management (dashboard sections, page metadata, site content)

### Project Structure
```
├── client/src/          # React frontend
│   ├── components/      # UI components (shadcn/ui in ui/)
│   ├── contexts/        # React contexts (AuthContext for edit mode)
│   ├── pages/           # Route page components
│   ├── lib/             # Utilities, data, API clients
│   └── hooks/           # Custom React hooks
├── server/              # Express backend
│   ├── index.ts         # Server entry point
│   ├── routes.ts        # API route definitions
│   └── storage.ts       # Data storage interface
├── shared/              # Shared code (schema, types)
├── supabase/migrations/ # Supabase SQL migrations
└── migrations/          # Drizzle database migrations
```

### Key Design Patterns
- **Path Aliases**: `@/` maps to client/src, `@shared/` maps to shared/
- **Component Architecture**: Page components in `/pages`, reusable UI in `/components`
- **Data Fetching**: Static data in `lib/data.ts`, CMS data via Supabase client
- **Export Features**: html-to-image for exporting charts as PNG images
- **Edit Mode**: Unified pending changes tracked in AuthContext, saved in bulk

## External Dependencies

### Database
- **PostgreSQL**: Primary database via `DATABASE_URL` environment variable
- **Drizzle ORM**: Schema management and query building

### Supabase CMS Tables
- `dashboard_sections` - Navigation cards with title, description, order
- `dashboard_page_meta` - Page headlines and intro text
- `site_content` - Generic key-value content storage for all pages
- `page_sections` - Custom sections per page with type, content, order
- `nav_items` - Custom navigation items with path, label, icon, order

### Key NPM Packages
- **UI**: @radix-ui/* primitives, lucide-react icons, recharts, class-variance-authority
- **Data**: @tanstack/react-query, drizzle-orm, @supabase/supabase-js
- **Utilities**: date-fns, zod for validation, html-to-image for exports
- **Drag & Drop**: @dnd-kit for dashboard card reordering

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (required for database features)
- `VITE_SUPABASE_URL`: Supabase project URL (required for CMS)
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key (required for CMS)
