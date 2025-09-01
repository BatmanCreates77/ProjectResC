# Overview

ResumeOptimizer Pro is an AI-powered resume optimization platform specifically designed for product designers seeking roles at top-tier companies like Google, Apple, Meta, and Figma. The application leverages Claude AI to provide personalized resume analysis, domain matching, and market intelligence through live job scraping. The platform offers completely free AI-powered optimization with optional user registration and focuses on providing both ATS compatibility and market relevance insights.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client is built using a modern React stack with Vite as the build tool. The UI leverages shadcn/ui components built on Radix UI primitives for accessibility and consistency. State management is handled through TanStack Query for server state and React hooks for local state. The application uses Wouter for client-side routing and supports both light and dark themes with localStorage persistence.

**Key Design Decisions:**
- **Component System**: shadcn/ui provides a consistent design system while maintaining customization flexibility
- **State Management**: TanStack Query eliminates the need for complex state management by handling server synchronization
- **Routing**: Wouter provides a lightweight alternative to React Router for simple navigation needs
- **File Upload**: Custom dropzone component with drag-and-drop support for PDF and text file uploads

## Backend Architecture
The server follows a Node.js/Express architecture with TypeScript support. API routes are organized in a centralized routing system that handles file uploads, resume analysis, and data persistence. The application uses a middleware-first approach for request logging, error handling, and file processing.

**Key Design Decisions:**
- **File Processing**: Multer handles multipart form uploads with size and type validation
- **PDF Parsing**: pdf-parse library extracts text content from uploaded PDF files
- **API Structure**: RESTful endpoints with clear separation of concerns
- **Error Handling**: Centralized error middleware with consistent error responses

## Data Storage Solutions
The application uses PostgreSQL as the primary database with Drizzle ORM for type-safe database operations. The schema is designed to support anonymous usage while allowing for future user registration features. Database connections are managed through Neon's serverless PostgreSQL with connection pooling.

**Key Design Decisions:**
- **ORM Choice**: Drizzle provides excellent TypeScript integration and performance
- **Schema Design**: Supports both anonymous and authenticated usage patterns
- **Relationships**: Clear foreign key relationships between resumes, analyses, and job postings
- **Data Types**: JSONB fields store complex data structures like skills and recommendations

## Authentication and Authorization
Currently implements anonymous usage patterns with optional user identification. The system is designed to support future authentication features through nullable user relationships in the database schema.

**Key Design Decisions:**
- **Anonymous First**: Users can analyze resumes without creating accounts
- **Future Ready**: Database schema supports user authentication when needed
- **Session Management**: Prepared for session-based authentication with connect-pg-simple

# External Dependencies

## AI Services
- **Anthropic Claude AI**: Primary AI service for resume parsing, analysis, and optimization using the latest claude-sonnet-4-20250514 model
- **OpenAI GPT-4**: Alternative AI service referenced in project documentation for resume analysis

## Database and Storage
- **Neon Database**: Serverless PostgreSQL hosting with automatic scaling and connection pooling
- **Drizzle ORM**: Type-safe database operations and schema management
- **WebSocket Support**: Neon serverless requires WebSocket constructor for database connections

## File Processing
- **Multer**: Handles multipart form data for file uploads with validation
- **pdf-parse**: Extracts text content from PDF files for analysis
- **File Type Validation**: Supports PDF and plain text file formats with size limits

## UI and Styling
- **Radix UI**: Comprehensive set of accessible, unstyled UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **shadcn/ui**: Pre-built component library based on Radix UI and Tailwind CSS
- **Lucide React**: Icon library for consistent iconography

## Development Tools
- **Vite**: Fast build tool and development server with React support
- **TypeScript**: Type safety across frontend and backend
- **ESBuild**: Production bundling for server-side code
- **Replit Integration**: Development environment optimization with cartographer and error overlay plugins

## Planned Integrations
- **Job Scraping**: Puppeteer for LinkedIn and Indeed job data collection
- **Salary Data**: Integration with Glassdoor, Levels.fyi, and LinkedIn for market insights
- **Payment Processing**: Stripe integration for premium features (referenced in documentation)