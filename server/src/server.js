import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import aiRoutes from './routes/aiRoutes.js';
import parseRoutes from './routes/parseRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// CORS configuration
const configuredOrigins = (config.clientUrl || '')
  .split(',')
  .map((u) => u.trim())
  .filter(Boolean);

const allowedOrigins = [
  ...configuredOrigins,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, server-to-server, curl)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        config.nodeEnv === 'development' ||
        origin.endsWith('.vercel.app')
      ) {
        return callback(null, true);
      }
      return callback(new Error(`CORS: Origin '${origin}' is not permitted.`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsing with safe size limit
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'CareerKit Backend API',
    geminiConfigured: Boolean(config.geminiApiKey && !config.geminiApiKey.includes('your-gemini-api-key')),
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/ai', aiRoutes);
app.use('/api/parse', parseRoutes);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized Error Handler
app.use(errorHandler);

// Start Server
const server = app.listen(config.port, () => {
  console.log(`CareerKit server running on port ${config.port} in ${config.nodeEnv} mode`);
  console.log(`Allowed client origin: ${config.clientUrl}`);
  console.log(
    `Gemini API Status: ${
      config.geminiApiKey && !config.geminiApiKey.includes('your-gemini-api-key')
        ? 'Configured (Active)'
        : 'Not configured (Set GEMINI_API_KEY in server/.env)'
    }`
  );
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    process.exit(0);
  });
});

export default app;
