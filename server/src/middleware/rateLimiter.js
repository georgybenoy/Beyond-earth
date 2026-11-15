import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 300 requests per 15-minute window
  standardHeaders: true, // Return standard RateLimit-* headers
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === 'test', // Skip in automated tests
  message: {
    success: false,
    message: 'Too many deep space telemetry requests. Please calibrate your transmission rate and try again in a few minutes.'
  }
});
