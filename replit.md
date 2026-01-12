# FCPMS - Fuel Cell Power Management System

## Overview

FCPMS is a technical engineering tool for sizing and comparing fuel cell power systems against traditional diesel generators. The application targets telecom infrastructure, enabling engineers to design power systems by selecting fuel cell models, calculating battery requirements, hydrogen consumption, and generating professional reports. Key features include:

- Fuel cell vs diesel generator comparison and sizing
- Asset optimization for existing generator fleets
- Equipment catalog with manufacturer specifications
- Remote monitoring dashboard
- Case studies and hydrogen strategy planning
- Bilingual support (English/Arabic)

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state caching and synchronization
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom engineering-focused theme (blue/slate color palette)
- **Charts**: Recharts for data visualization (load profiles, comparisons)
- **Forms**: React Hook Form with Zod validation
- **3D Visualization**: React Three Fiber with Drei for fuel cell component viewer

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ESM modules)
- **API Pattern**: REST endpoints defined in `shared/routes.ts` with Zod schemas for request/response validation
- **Build**: Vite for frontend, esbuild for server bundling
- **Python Service**: Flask microservice on port 5001 for AI analysis and PDF generation (uses Gunicorn in production)

### Data Storage
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with drizzle-zod for schema-to-validation integration
- **Schema Location**: `shared/schema.ts` contains all table definitions
- **Key Tables**:
  - `fuel_cells`: Catalog of fuel cell specifications (manufacturer, model, power ratings, efficiency, costs)
  - `projects`: Saved sizing projects with input parameters and calculated results
  - `app_users`: App-specific user accounts with role-based access (super_admin, admin, user)
  - `users`: Replit Auth user accounts
  - `sessions`: Session storage for authentication
  - `registration_requests`: Pending user registrations awaiting admin approval
  - `otp_codes`: OTP verification codes for email/phone authentication
  - `blog_posts`, `blog_comments`, `contact_messages`: Content management

### Authentication
- **Direct Google OAuth**: Primary authentication method
  - Auth routes: `/api/auth/google`, `/api/auth/google/callback`, `/api/auth/user`, `/api/logout`
  - Server module: `server/google-auth.ts`
  - Client hook: `client/src/hooks/use-auth.ts`
  - Secrets required: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- **Replit Auth** (fallback): OpenID Connect authentication via Replit
- **App-specific Auth**: Custom email/phone authentication with OTP verification

### Build Configuration
- Frontend builds to `dist/public`
- Server bundles to `dist/index.cjs`
- Development runs with `tsx` for TypeScript execution
- Production uses bundled CommonJS output

## External Dependencies

### Third-Party Services
- **Google OAuth**: User authentication via Google accounts
- **Twilio**: SMS OTP delivery for phone verification (via Replit connector)
- **Resend**: Email OTP delivery and transactional emails (via Replit connector)
- **Google Gemini AI**: AI-powered system analysis and recommendations

### Database
- **PostgreSQL**: Primary data store (provisioned via Replit)
- **Drizzle ORM**: Database migrations via `drizzle-kit push`

### Key NPM Packages
- `@tanstack/react-query`: Server state management
- `@radix-ui/*`: Accessible UI primitives
- `recharts`: Data visualization
- `framer-motion`: Animations
- `@react-three/fiber`, `@react-three/drei`: 3D rendering
- `zod`: Runtime type validation
- `drizzle-orm`: Database ORM
- `passport`: Authentication middleware
- `fpdf` (Python): PDF report generation

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `GEMINI_API_KEY`: Google Gemini AI API key (optional, for AI features)