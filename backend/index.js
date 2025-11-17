import express from 'express';
import dotenv  from 'dotenv';
dotenv.config();
import connectDb from './config/db.js';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js';
import cors from 'cors';
import userRouter from './routes/user.routes.js';

import reportRouter from './routes/report.routes.js';
import fs from "fs";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 4040;

app.use(cors({
    origin: [ 
        "http://localhost:5173",
        "https://gocity.onrender.com"
    ],
    credentials: true
}));


app.use(express.json())
app.use(cookieParser())

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Serve static files
app.use('/uploads', express.static(uploadsDir));

// API routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/reports", reportRouter);




const start = async () => {
    try{
        await connectDb();
        app.listen(port,() => console.log(`Server running at ${port}`));
    }catch(err){
        console.error('Failed to start server due to DB connection error:', err);
        process.exit(1);
    }
};

start();
