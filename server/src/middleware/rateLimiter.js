import rateLimit from 'express-rate-limit';
import { config } from '../config/env.js';

export const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => config.isTest,
  message: {
    success: false,
    message: 'Too many deep space telemetry requests. Please calibrate your transmission rate and try again in a few minutes.'
  }
});
