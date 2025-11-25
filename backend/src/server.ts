import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { rateLimit } from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for Replit/reverse proxy environments
app.set('trust proxy', 1);

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Rate limiting
import { errorHandler } from './middleware/error.middleware.js';
import { rateLimiter } from './middleware/rateLimit.middleware.js';

// Rate limiting
app.use(rateLimiter);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

import resumeRoutes from './routes/resume.routes.js';
import internshipRoutes from './routes/internship.routes.js';
import coachRoutes from './routes/coach.routes.js';
import paymentRoutes from './routes/payment.routes.js';

// Routes
app.use('/api/resumes', resumeRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/coach', coachRoutes);
app.use('/api/payments', paymentRoutes);

// Serve static frontend files in production
const frontendPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendPath));

// Handle SPA routing - serve index.html for non-API routes
app.get('/{*path}', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
