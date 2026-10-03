import { Request, Response, NextFunction } from 'express';
import { admin, isFirebaseReady } from '../config/firebase';

export interface AuthedRequest extends Request {
  firebaseUser?: {
    uid: string;
    email?: string;
    name?: string;
    picture?: string;
  };
}

export async function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  if (!isFirebaseReady()) {
    res.status(503).json({ error: 'Auth not configured' });
    return;
  }
  const header = req.headers.authorization || '';
  const match = header.match(/^Bearer (.+)$/);
  if (!match) {
    res.status(401).json({ error: 'Missing Bearer token' });
    return;
  }
  try {
    const decoded = await admin.auth().verifyIdToken(match[1]);
    req.firebaseUser = {
      uid: decoded.uid,
      email: decoded.email,
      name: decoded.name,
      picture: decoded.picture,
    };
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
