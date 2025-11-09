import { NextFunction, Request, Response } from 'express';
import { verifyJwt } from '@utils/jwt';

interface AuthenticatedRequest extends Request {
    userId?: string;
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'missing or invalid token' });
    }

    const token = auth.substring('Bearer '.length);

    try {
        const payload = verifyJwt(token);
        req.userId = payload.userId;
        next();
    } catch {
        return res.status(401).json({ error: 'invalid token' });
    }
};
