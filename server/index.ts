import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { rateLimit } from 'express-rate-limit';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import prayerRoutes from './routes/prayer.routes';
import quranRoutes from './routes/quran.routes';
import duaRoutes from './routes/dua.routes';
import bookmarkRoutes from './routes/bookmark.routes';
import communityRoutes from './routes/community.routes';
import progressRoutes from './routes/progress.routes';
import { errorHandler } from './middleware/error.middleware';
import { authenticate } from './middleware/auth.middleware';

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
}));

// General middleware
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/user', authenticate, userRoutes);
app.use('/api/prayer', authenticate, prayerRoutes);
app.use('/api/quran', authenticate, quranRoutes);
app.use('/api/dua', authenticate, duaRoutes);
app.use('/api/bookmarks', authenticate, bookmarkRoutes);
app.use('/api/community', authenticate, communityRoutes);
app.use('/api/progress', authenticate, progressRoutes);

// Error handling
app.use(errorHandler);

// Database connection
mongoose.connect(process.env.MONGODB_URI!)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});