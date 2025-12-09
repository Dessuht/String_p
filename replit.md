# String Dating App

## Overview

String is a dating application designed to foster deeper, more authentic connections between users. The app uses a unique "Tie the Knot" system that encourages real conversations and accountability, with features like star ratings, fidelity points, and scheduled date suggestions. The core philosophy is "no strings attached? No, we want strings" - prioritizing meaningful relationships over casual browsing.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS v4 with custom theme variables
- **UI Components**: shadcn/ui component library (New York style) with Radix UI primitives
- **Animations**: Framer Motion for transitions and micro-interactions
- **Build Tool**: Vite with custom plugins for meta images and Replit integration

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ESM modules)
- **API Style**: RESTful JSON endpoints under `/api/*`
- **Development**: tsx for TypeScript execution, Vite dev server with HMR proxy

### Data Storage
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` (shared between client and server)
- **Validation**: Zod schemas generated via drizzle-zod
- **Current State**: In-memory storage implementation exists (`MemStorage` class) for development, with database schema ready for PostgreSQL

### Key Data Models
- **Users**: Profile info, verification status, star ratings, fidelity points, daily tugs
- **Tugs**: Expression of interest from one user to another (like "likes")
- **Matches**: Created when mutual tugs occur between users
- **Ratings**: Post-interaction feedback system affecting star ratings
- **RadarScans**: Location-based discovery feature with boost functionality

### Core Features
1. **Tug System**: Limited daily actions to express interest, mutual tugs create matches
2. **Star Rating**: User reputation based on community feedback (affects visibility)
3. **Fidelity Points**: In-app currency for premium features like radar boosts
4. **Tie the Knot Flow**: Message threshold before unlocking permanent chat features
5. **Date Suggestions**: Integrated location recommendations for real-world meetups
6. **Radar**: Location-based discovery with temporary visibility boosts

### Project Structure
```
├── client/           # React frontend application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Route-based page components
│   │   ├── hooks/        # Custom React hooks
│   │   └── lib/          # Utilities, mock data, query client
├── server/           # Express backend
│   ├── routes.ts     # API endpoint definitions
│   ├── storage.ts    # Data access layer (memory/DB)
│   └── index.ts      # Server entry point
├── shared/           # Shared code between client/server
│   └── schema.ts     # Drizzle database schema
└── migrations/       # Database migrations (Drizzle Kit)
```

## External Dependencies

### Database
- **PostgreSQL**: Primary database (configured via `DATABASE_URL` environment variable)
- **Drizzle Kit**: Schema migrations with `db:push` command

### UI Framework
- **Radix UI**: Accessible component primitives (dialog, dropdown, tabs, etc.)
- **Lucide React**: Icon library
- **Embla Carousel**: Carousel component
- **Vaul**: Drawer component
- **cmdk**: Command palette component

### Development Tools
- **Vite**: Frontend build and dev server
- **esbuild**: Production server bundling
- **TypeScript**: Type checking across full stack

### Session Management
- **connect-pg-simple**: PostgreSQL session store (available but sessions not fully implemented)
- **express-session**: Session middleware

### Fonts
- **Google Fonts**: Outfit (sans-serif) and Playfair Display (serif) loaded via CDN