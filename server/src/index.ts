import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import healthRouter from './routes/health';
import { requireAuth, type AuthedRequest } from './middleware/requireAuth';
import { initFirebase } from './config/firebase';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

initFirebase();

app.use(helmet());
app.use(
  cors({
    origin: CLIENT_URL.split(',').map((s) => s.trim()),
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'longwork API running', version: '1.0.0' });
});

app.use('/api/health', healthRouter);

// Verified Firebase user profile (requires Google sign-in on the client)
app.get('/api/me', requireAuth, (req: AuthedRequest, res: Response) => {
  res.json({ user: req.firebaseUser });
});

// Render health check (GET /health -> same as /api/health)
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// 404
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
