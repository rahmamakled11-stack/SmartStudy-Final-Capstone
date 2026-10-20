import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import { specs } from '@/config/swagger';
import { connectDB } from '@/config/database';
import { errorHandler } from '@/middleware/errorHandler';
import { securityHeaders } from '@/middleware/security';
import routes from '@/routes';
import logger from '@/utils/logger';
import config from '@/config/env';

const app: Application = express();

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());
app.use(securityHeaders);

// Stripe webhook needs RAW body before express.json()
app.use('/api/v1/subscriptions/webhook', express.raw({ type: 'application/json' }));

// CORS - Allow all origins for development (restrict in production)
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Body parsing (after CORS, after Stripe webhook)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Logging
if (config.NODE_ENV !== 'test') {
  app.use(morgan('combined', {
    stream: {
      write: (message: string) => logger.info(message.trim()),
    },
  }));
}

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV,
  });
});

// API Routes
app.use('/api/v1', routes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global error handler
app.use(errorHandler);

export default app;
