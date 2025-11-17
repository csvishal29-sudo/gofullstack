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
// If your app is behind a proxy (Render, Heroku, etc.) enable this so secure cookies work
app.set('trust proxy', 1);

const port = process.env.PORT || 4040;
// Recommended: set FRONTEND_URL in Render env to your deployed frontend (e.g. https://gocity.onrender.com)
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';



// CORS: allow the frontend origin and localhost during development
app.use(cors({
  origin: (origin, callback) => {
    // allow requests like curl or mobile apps with no origin
    if (!origin) return callback(null, true);
    const allowed = [FRONTEND_URL, 'http://localhost:5173'];
    if (allowed.includes(origin)) return callback(null, true);
    return callback(new Error('CORS not allowed by server'));
  },
  credentials: true
}));

app.use(express.json());
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
  sameSite: 'none', // required for cross-site cookies
  maxAge: 7 * 24 * 60 * 60 * 1000
};

// Example usage inside your auth routes when setting cookie:
// res.cookie('token', token, cookieOptions);

const start = async () => {
  try {
    // connectDb should read process.env.MONGODB_URL internally
    await connectDb();

    // bind to 0.0.0.0 so Render/Docker can reach it
    app.listen(port, '0.0.0.0', () => console.log(`Server running on port ${port}`));
  } catch (err) {
    console.error('Failed to start server due to DB connection error:', err);
    process.exit(1);
  }
};

start();
