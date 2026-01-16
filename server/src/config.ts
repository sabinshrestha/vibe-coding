import dotenv from 'dotenv';

dotenv.config();

export default {
  port: process.env.PORT || 5000,
  mongoUrl: process.env.MONGODB_URL || 'mongodb://localhost:27017/vibe-marketplace',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  stripeKey: process.env.STRIPE_KEY || '',
  nodeEnv: process.env.NODE_ENV || 'development',
};
