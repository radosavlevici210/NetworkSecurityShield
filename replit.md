# SecureGuard - System Security Management

## Overview

SecureGuard is a comprehensive security management dashboard built as a full-stack web application. It provides centralized control over system security settings including remote access management, firewall configuration, service monitoring, and activity logging. The application features a modern React frontend with shadcn/ui components and an Express.js backend with PostgreSQL database integration.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite with custom configuration for development and production

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Pattern**: RESTful API endpoints under `/api` prefix
- **Session Management**: Express sessions with PostgreSQL store
- **Development**: Hot reloading with Vite middleware integration

### Key Components

1. **Security Dashboard**
   - Real-time security status overview
   - Remote access control (RDP, SSH, VNC)
   - Windows Firewall management
   - System services monitoring
   - Activity logs and audit trail

2. **Database Schema**
   - Users table for authentication
   - Security settings for configuration state
   - Services table for system service management
   - Activity logs for audit trail
   - Firewall rules for network security policies

3. **External Integration**
   - Windows system commands via child process execution
   - Batch script execution for system configuration
   - Network firewall rule management

## Data Flow

1. **User Interaction**: User interacts with React components in the dashboard
2. **API Requests**: Frontend makes HTTP requests to Express backend via TanStack Query
3. **Data Processing**: Backend processes requests and executes system commands when needed
4. **Database Operations**: Drizzle ORM handles database queries and updates
5. **Real-time Updates**: Query invalidation triggers UI updates across components
6. **Activity Logging**: All security changes are logged to the activity logs table

## External Dependencies

### Frontend Dependencies
- React ecosystem (React, React DOM, React Router alternative)
- UI framework (Radix UI components, Tailwind CSS)
- Form handling (React Hook Form with Zod validation)
- Icons (Lucide React)
- Date utilities (date-fns)

### Backend Dependencies
- Express.js with TypeScript support
- Database layer (Drizzle ORM, Neon Database client)
- Development tools (tsx for TypeScript execution)
- Session management (connect-pg-simple)

### Development Tools
- Vite for frontend bundling and development server
- ESBuild for backend bundling
- TypeScript for type safety
- Replit-specific plugins for development environment

## Deployment Strategy

### Development Environment
- **Command**: `npm run dev`
- **Process**: Concurrent frontend (Vite) and backend (tsx) development servers
- **Hot Reload**: Both frontend and backend support hot reloading
- **Port**: Application runs on port 5000

### Production Build
- **Frontend**: `vite build` - outputs static files to `dist/public`
- **Backend**: `esbuild` - bundles server code to `dist/index.js`
- **Deployment**: Single Node.js process serving both API and static files
- **Environment**: Replit autoscale deployment target

### Database Management
- **Schema**: Defined in `shared/schema.ts` using Drizzle ORM
- **Migrations**: Generated in `./migrations` directory
- **Push**: `npm run db:push` for schema synchronization

## Changelog

```
Changelog:
- June 18, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```