# Overview

This is a comprehensive school website application for DAV Public School, Asansol, built with a modern full-stack architecture. The application serves as the official website for the CBSE-affiliated school (Affiliation No. 2430088), providing information about academics, admissions, events, and contact functionality.

## User Preferences

Preferred communication style: Simple, everyday language.
Code-free content management: All website editing must be done through web interfaces, no coding required.

## System Architecture

The application follows a full-stack architecture with a clear separation between frontend and backend components:

- **Frontend**: React-based single-page application with modern UI components
- **Backend**: Express.js API server with REST endpoints
- **Database**: PostgreSQL with Drizzle ORM for data management
- **Build System**: Vite for frontend bundling and development
- **Styling**: Tailwind CSS with custom design system

## Key Components

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **UI Components**: Radix UI primitives with custom styling
- **Styling**: Tailwind CSS with custom DAV school branding
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Validation**: Zod schemas for request/response validation
- **Session Management**: In-memory storage with future database support
- **API Design**: RESTful endpoints with proper error handling

### Database Schema
The application uses five main entities:
- **Users**: Authentication and user management
- **Contacts**: Contact form submissions
- **News**: School news and announcements
- **Events**: School events and activities
- **Testimonials**: User testimonials and reviews

Each entity includes proper timestamps, validation, and active/inactive status flags.

## Data Flow

1. **Client Requests**: React components use TanStack Query to fetch data from API endpoints
2. **API Layer**: Express.js routes handle requests and validate data using Zod schemas
3. **Data Layer**: Drizzle ORM manages database operations with type-safe queries
4. **Response**: JSON responses are returned to the client with proper error handling

The application supports both development and production modes with different storage implementations (in-memory for development, database for production).

## External Dependencies

### Frontend Dependencies
- **UI Framework**: Radix UI components for accessible, unstyled primitives
- **Icons**: Font Awesome for consistent iconography
- **Fonts**: Inter font from Google Fonts
- **Validation**: Zod for runtime type validation
- **HTTP Client**: Built-in fetch with TanStack Query wrapper

### Backend Dependencies
- **Database**: Neon Database (PostgreSQL) for production
- **ORM**: Drizzle ORM for type-safe database operations
- **Session Storage**: connect-pg-simple for PostgreSQL session storage
- **Utilities**: Various utility libraries for date handling and validation

### Development Dependencies
- **Build Tool**: Vite with React plugin
- **Development**: Replit-specific plugins for development environment
- **Code Quality**: TypeScript for type safety and ESM modules

## Deployment Strategy

The application is configured for deployment on Replit with the following setup:

### Build Process
- **Frontend**: Vite builds the React application to `dist/public`
- **Backend**: esbuild bundles the Express server to `dist/index.js`
- **Database**: Drizzle generates migrations and handles schema changes

### Environment Configuration
- **Development**: Uses Vite dev server with hot reload and middleware mode
- **Production**: Serves static files from Express with API endpoints
- **Database**: Requires `DATABASE_URL` environment variable for PostgreSQL connection

### Scripts
- `dev`: Runs development server with hot reload
- `build`: Builds both frontend and backend for production
- `start`: Runs production server
- `db:push`: Pushes database schema changes

The application is designed to work seamlessly in both development and production environments, with proper error handling, logging, and performance optimizations.