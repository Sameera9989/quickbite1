import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDB } from './utils/db.js';
import authRoutes from './routes/auth.js';
import restaurantRoutes from './routes/restaurants.js';
import menuRoutes from './routes/menu.js';
import orderRoutes from './routes/orders.js';
import feedbackRoutes from './routes/feedback.js';
import issueRoutes from './routes/issues.js';
import trackingRoutes from './routes/tracking.js';
import paymentRoutes from './routes/payment.js';

dotenv.config();
const app = express();
app.disable('etag');

// Relaxed CORS for local/dev: allow localhost and common LAN addresses
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    try {
      const u = new URL(origin);
      const host = u.hostname;
      const isLocal = host === 'localhost' || host === '127.0.0.1' || host === '::1';
      const isLan = /^172\./.test(host) || /^192\.168\./.test(host) || /^10\./.test(host);
      if (isLocal || isLan) return cb(null, true);
    } catch (e) {}
    // Fallback to explicit allow via env
    if (process.env.CLIENT_URL && origin === process.env.CLIENT_URL) return cb(null, true);
    return cb(null, false);
  },
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(morgan('dev'));

app.get('/', (req, res) => res.json({ status: 'OK', service: 'QuickBite API' }));

app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/payment', paymentRoutes);

const PORT = process.env.PORT || 4000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`QuickBite API running on http://localhost:${PORT}`));
});
