# TwentySix Pay & Benefits Dashboard

## Overview

This is a salary benchmarking and market insights dashboard built for HR professionals and organizations. The application provides personalized pay analysis, market comparisons, benefits breakdowns, and strategic recommendations for reward planning.

The dashboard displays market data for job roles, comparing actual salaries against market quartiles (lower quartile, median, upper quartile), identifies pay positioning strengths and risks, and provides guidance on benefits trends and next steps for compensation planning.

## User Preferences

Preferred communication style: Simple, everyday language.

## Inline Edit Mode (Admin CMS)

The dashboard includes an inline edit mode that allows authenticated admins to edit content directly on any page:

### How to Enable Edit Mode
1. Click "Edit as Admin" in the sidebar footer
2. Log in with your Supabase credentials
3. Edit mode activates automatically after login

### Edit Mode Features
- **Click to Edit**: Click any text with a pencil icon to edit it inline
- **Drag & Drop**: Reorder dashboard cards by dragging the grip handles
- **Global Toolbar**: Floating toolbar at bottom with Save, Undo, and Exit buttons
- **Visual Indicators**: Edited fields highlight in amber until saved

### Supabase Setup Required
Before edit mode works, you must run the database migrations in your Supabase project:
1. Go to your Supabase dashboard → SQL Editor
2. Copy the contents of `supabase/migrations/full_setup.sql`
3. Run the SQL to create tables and policies

### Key Components
- `AuthContext.tsx` - Manages auth state, edit mode, and pending changes
- `EditableText.tsx` - Click-to-edit wrapper for any text element
- `GlobalEditToolbar.tsx` - Floating save/undo/exit toolbar
- `siteContent.ts` - Content cache and persistence layer

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

### Key NPM Packages
- **UI**: @radix-ui/* primitives, lucide-react icons, recharts, class-variance-authority
- **Data**: @tanstack/react-query, drizzle-orm, @supabase/supabase-js
- **Utilities**: date-fns, zod for validation, html-to-image for exports
- **Drag & Drop**: @dnd-kit for dashboard card reordering

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (required for database features)
- `VITE_SUPABASE_URL`: Supabase project URL (required for CMS)
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key (required for CMS)
