import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import destinationRoutes from './routes/destinationRoutes.js';
import hardwareRoutes from './routes/hardwareRoutes.js';
import timelineRoutes from './routes/timelineRoutes.js';
import scienceRoutes from './routes/scienceRoutes.js';
import statusRoutes from './routes/statusRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { config } from './config/env.js';

const app = express();

// Trust reverse proxy for accurate client IP resolution on Render/edge deployments
app.set('trust proxy', 1);

// Disable Express fingerprinting header
app.disable('x-powered-by');

// Security headers with Helmet, configuring CORP so web clients can access JSON resources safely
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false // API does not serve HTML; client manages CSP
}));

// Explicit trusted origins
const explicitOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:4173',
  'http://127.0.0.1:4173',
  'https://beyond-earth-ten.vercel.app',
  'https://beyond-earth.vercel.app'
];

if (config.clientUrl) {
  // Support comma-separated URLs and strip trailing slashes
  config.clientUrl.split(',').forEach(url => {
    const trimmed = url.trim().replace(/\/$/, '');
    if (trimmed && !explicitOrigins.includes(trimmed)) {
      explicitOrigins.push(trimmed);
    }
  });
}

// Hardened CORS: explicit origins, no ambient credentials required for public API
app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (mobile apps, curl, server-to-server) or local development
    if (!origin || config.nodeEnv === 'development' || explicitOrigins.includes(origin)) {
      return callback(null, true);
    }
    // Allow project-specific Vercel preview deployments (beyond-earth*.vercel.app)
    if (/^https:\/\/beyond-earth(-[a-zA-Z0-9_-]+)?\.vercel\.app$/.test(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: false,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Bound request body size to prevent payload exhaustion
app.use(express.json({ limit: '100kb' }));

if (config.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

// Rate limiting on public API endpoints
app.use('/api/v1/', apiLimiter);

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Beyond Earth NASA Space Apps API',
    version: '1.0.0'
  });
});

// Mount modular API routes
app.use('/api/v1/destinations', destinationRoutes);
app.use('/api/v1/hardware', hardwareRoutes);
app.use('/api/v1/timeline', timelineRoutes);
app.use('/api/v1/science', scienceRoutes);
app.use('/api/v1/status', statusRoutes);
app.use('/api/v1/academy/quizzes', quizRoutes);

// Catch 404 and forward to error handler
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
