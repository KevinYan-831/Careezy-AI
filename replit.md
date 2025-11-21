# Careezy - Career Platform

## Overview
Careezy is a full-stack career development platform that helps users build resumes, find internships, and get career coaching. The application uses AI services for resume optimization and career advice.

**Last Updated**: November 21, 2025

## Project Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Styling**: TailwindCSS
- **Router**: React Router DOM v6
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Rich Text Editor**: TipTap
- **UI Components**: Lucide React icons, React Hot Toast
- **Port**: 5000 (configured for Replit)

### Backend
- **Framework**: Express 5 with TypeScript
- **Language**: Node.js (ES Modules)
- **APIs**: 
  - Resume management endpoints
  - AI services (OpenAI, Anthropic)
  - Supabase integration
  - Stripe payments
- **Security**: Helmet, CORS, Rate limiting
- **Port**: 3001

### External Services
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI**: OpenAI and Anthropic (Claude)
- **Payments**: Stripe
- **Document Processing**: Puppeteer, Mammoth, PDF Parse

## Project Structure
```
/
├── frontend/           # React frontend application
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   └── vite.config.ts  # Vite configuration
├── backend/            # Express backend API
│   └── src/
│       ├── controllers/ # Request handlers
│       ├── middleware/  # Auth and validation
│       ├── routes/      # API routes
│       ├── services/    # Business logic (AI, etc.)
│       └── server.ts    # Server entry point
└── replit.md           # This file
```

## Environment Variables
The application requires the following environment variables:
- `FRONTEND_URL`: Frontend URL for CORS
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_KEY`: Supabase API key
- `OPENAI_API_KEY`: OpenAI API key
- `ANTHROPIC_API_KEY`: Anthropic API key
- `STRIPE_SECRET_KEY`: Stripe secret key

## Recent Changes
- **2025-11-21**: Initial import from GitHub and Replit environment setup
  - Configured Vite to run on port 5000 with host allowance
  - Installed Node.js 20 toolchain
  - Set up frontend workflow for development

## Development
- Frontend dev server runs on port 5000 (Vite)
- Backend API runs on port 3001 (Express)
- Both use TypeScript with hot reload
