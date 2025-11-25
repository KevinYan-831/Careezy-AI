# Careezy - Career Platform

## Overview
Careezy is a full-stack career development platform that helps users build resumes, find internships, and get career coaching. The application uses AI services for resume optimization and career advice.

**Last Updated**: November 25, 2025

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
- **Port**: 5000 (development via Vite)

### Backend
- **Framework**: Express 5 with TypeScript
- **Language**: Node.js 20 (ES Modules)
- **APIs**: 
  - Resume management endpoints (`/api/resumes`)
  - Internship endpoints (`/api/internships`)
  - AI Career Coach (`/api/coach`)
  - Payment processing (`/api/payments`)
- **Security**: Helmet, CORS, Rate limiting, Trust proxy
- **Port**: 5000 (serves both API and static frontend in production)

### External Services
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI**: DeepSeek (via OpenAI-compatible API)
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
│       ├── config/      # Supabase configuration
│       ├── controllers/ # Request handlers
│       ├── middleware/  # Auth, rate limiting, validation
│       ├── routes/      # API routes
│       ├── services/    # Business logic (AI, Adzuna)
│       └── server.ts    # Server entry point
├── build.sh            # Build script for deployment
├── package.json        # Root package.json for deployment
└── replit.md           # This file
```

## Environment Variables
The application requires the following environment variables:
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_SERVICE_KEY`: Supabase service role key
- `DEEPSEEK_API_KEY`: DeepSeek API key for AI features
- `STRIPE_SECRET_KEY`: Stripe secret key for payments
- `FRONTEND_URL`: Frontend URL for CORS (optional)

## Deployment
- **Type**: Autoscale deployment
- **Build**: `bash build.sh` (builds both frontend and backend)
- **Run**: `node backend/dist/server.js` (serves API + static frontend)
- Backend serves the frontend static files from `frontend/dist`

## Development
- Frontend dev server runs on port 5000 (Vite with hot reload)
- For development, run `cd frontend && npm run dev`
- Backend can be run separately with `cd backend && npm run dev`

## Recent Changes
- **2025-11-25**: Full setup for Replit deployment
  - Configured autoscale deployment with frontend + backend
  - Added lazy initialization for external services (Supabase, Stripe, AI)
  - Server starts without API keys (features require keys when used)
  - Fixed Express 5 wildcard routing syntax
  - Added trust proxy for rate limiting in proxy environment
  - Added "Still in Development" banner to indicate work-in-progress
