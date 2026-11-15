import dotenv from 'dotenv';
dotenv.config();

const parseAllowedOrigins = () => {
  const baseOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:4173',
    'http://127.0.0.1:4173',
    'https://beyond-earth-ten.vercel.app',
    'https://beyond-earth.vercel.app'
  ];

  if (process.env.CLIENT_URL) {
    process.env.CLIENT_URL.split(',').forEach((url) => {
      const trimmed = url.trim().replace(/\/$/, '');
      if (trimmed && !baseOrigins.includes(trimmed)) {
        baseOrigins.push(trimmed);
      }
    });
  }

  return Object.freeze(baseOrigins);
};

export const config = Object.freeze({
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isDev: (process.env.NODE_ENV || 'development') === 'development',
  isTest: process.env.NODE_ENV === 'test',
  isProd: process.env.NODE_ENV === 'production',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  allowedOrigins: parseAllowedOrigins(),
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX || '300', 10)
  },
  bodyLimit: process.env.BODY_LIMIT || '100kb',
  supabaseUrl: process.env.SUPABASE_URL || null,
  supabaseKey: process.env.SUPABASE_ANON_KEY || null,
  nasaApiKey: process.env.NASA_API_KEY || 'DEMO_KEY'
});
