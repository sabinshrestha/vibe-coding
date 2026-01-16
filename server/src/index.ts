import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import config from './config';
import swaggerSpec from './swagger';
import authRoutes from './routes/auth';
import serviceRoutes from './routes/services';
import orderRoutes from './routes/orders';

const app = express();

// CORS Middleware - must be first
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"],
  exposedHeaders: ["Content-Length", "Content-Type"],
  maxAge: 86400 // 24 hours
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.headers.origin || 'none'}`);
  next();
});


// Connect to MongoDB
mongoose
  .connect(config.mongoUrl)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Vibe Marketplace API Docs',
}));

// API documentation JSON
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/orders', orderRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Start server
const server = app.listen(config.port, '0.0.0.0', () => {
  console.log(`Server running on port ${config.port}`);
  console.log(`Local: http://localhost:${config.port}`);
  if (process.env.CODESPACE_NAME) {
    console.log(`Codespace: https://${process.env.CODESPACE_NAME}-${config.port}.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}`);
  }
});
