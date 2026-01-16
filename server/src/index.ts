import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import config from './config';
import authRoutes from './routes/auth';
import serviceRoutes from './routes/services';
import orderRoutes from './routes/orders';

const app = express();

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow localhost and Codespace URLs
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      /^https:\/\/.*\.app\.github\.dev$/,
    ];
    
    const isAllowed = allowedOrigins.some(pattern => 
      pattern instanceof RegExp ? pattern.test(origin) : pattern === origin
    );
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"]
}));

// IMPORTANT: allow browser preflight requests
app.options("*", cors());

app.use(express.json());


// Connect to MongoDB
mongoose
  .connect(config.mongoUrl)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

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
