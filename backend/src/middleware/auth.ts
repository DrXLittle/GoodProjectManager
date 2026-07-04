import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      email?: string;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid token' });
    }

    const token = authHeader.slice(7);
    const payload = verifyToken(token);

    req.userId = payload.userId;
    req.email = payload.email;

    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

export async function checkProjectPermission(req: Request, res: Response, next: NextFunction) {
  try {
    const { projectId } = req.params;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // TODO: Implement permission check with Redis cache and database
    // For now, allow all authenticated users
    next();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
