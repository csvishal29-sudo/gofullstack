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


app.set('trust proxy', 1);

const port = process.env.PORT || 4040;


const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';


app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With']
}));

// Helpful: handle CORS errors gracefully in dev
app.use((err, req, res, next) => {
  if (err && err.message && err.message.indexOf('CORS') !== -1) {
    return res.status(403).json({ message: 'CORS error: origin not allowed' });
  }
  next(err);
});

app.use(express.json({ limit: '10mb' })); 
app.use(cookieParser());


const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files
app.use('/uploads', express.static(uploadsDir));


app.get('/', (req, res) => res.json({ ok: true, env: process.env.NODE_ENV || 'development' }));

// API routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/reports', reportRouter);


export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', 
  sameSite: 'none',
  path: '/',         
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

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
