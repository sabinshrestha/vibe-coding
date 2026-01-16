import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import config from './config';
import authRoutes from './routes/auth';
import serviceRoutes from './routes/services';
import orderRoutes from './routes/orders';

const app = express();

// Middleware
app.use(cors());
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
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
