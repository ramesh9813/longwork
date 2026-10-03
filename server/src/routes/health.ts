import { Router, Request, Response } from 'express';
import { isFirebaseReady } from '../config/firebase';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    firebase: isFirebaseReady() ? 'connected' : 'not-configured',
  });
});

router.get('/firebase', (_req: Request, res: Response) => {
  res.json({ firebaseReady: isFirebaseReady() });
});

export default router;
