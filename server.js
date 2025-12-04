
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import compression from 'compression';
import dotenv from 'dotenv';
import productRoutes from './routes/products.js';
import authRoutes from './routes/auth.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || (process.env.NODE_ENV === 'development' ? 5001 : 5000);

// Middleware
app.use(compression()); // Enable gzip compression

// CORS configuration for both development and production
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      'https://anusriapparels.shop',
      'http://localhost:3000',
      'http://localhost:5173', // Vite default
      'http://localhost:8080', // Current frontend port
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:8080'
    ];

    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Cache-Control']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '100mb' }));

// Add caching headers for static assets
app.use('/api', (req, res, next) => {
  // Cache API responses for 5 minutes
  res.set('Cache-Control', 'public, max-age=300');
  next();
});

// MongoDB connection
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://anusriapparels5_db_user:VRx9ahm43M99l0kz@cluster0.6wo7rrq.mongodb.net/?appName=Cluster0';

mongoose.connect(mongoURI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
