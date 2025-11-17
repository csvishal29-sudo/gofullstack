import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDb from './config/db.js';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js';
import cors from 'cors';
import userRouter from './routes/user.routes.js';
import reportRouter from './routes/report.routes.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// If your app is behind a proxy (Render, Heroku, Cloudflare, etc.) enable this so secure cookies work
app.set('trust proxy', 1);

const port = process.env.PORT || 4040;

// REQUIRED: set FRONTEND_URL env var to your deployed frontend origin,
// e.g. https://gocity.onrender.com (no trailing slash).
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Build allowed origins array so it's explicit and easy to change
const allowedOrigins = [FRONTEND_URL, 'http://localhost:5173'];

// CORS: allow the frontend origin(s) and include credentials
app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
    return callback(new Error('CORS not allowed by server'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
}));

// Helpful: handle CORS errors gracefully in dev
app.use((err, req, res, next) => {
  if (err && err.message && err.message.indexOf('CORS') !== -1) {
    return res.status(403).json({ message: 'CORS error: origin not allowed' });
  }
  next(err);
});

app.use(express.json({ limit: '10mb' })); // allow larger payloads if you accept base64 images
app.use(cookieParser());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files
app.use('/uploads', express.static(uploadsDir));

// Simple health check route (useful for Render and debugging)
app.get('/', (req, res) => res.json({ ok: true, env: process.env.NODE_ENV || 'development' }));

// API routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/reports', reportRouter);

// Helper: secure cookie options for production
export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // must be true on HTTPS
  sameSite: 'none', // required to send cookies in cross-site contexts
  path: '/',         // ensure cookie is sent for all paths on the domain
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// Example: when you sign in, set cookie like this (put inside your login route):
// const token = createJwtForUser(user);
// res.cookie('token', token, cookieOptions);
// res.json({ ok: true, userId: user._id });

// Note: if you need to clear cookie on logout:
// res.clearCookie('token', { path: '/' });
// res.json({ ok: true });

const start = async () => {
  try {
    await connectDb();
    app.listen(port, '0.0.0.0', () => console.log(`Server running on port ${port}`));
  } catch (err) {
    console.error('Failed to start server due to DB connection error:', err);
    process.exit(1);
  }
};

start();
