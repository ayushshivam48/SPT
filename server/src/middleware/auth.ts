import jwt from 'jsonwebtoken';
import { type Request, type Response, type NextFunction } from 'express';
import type { JWTPayload, UserRole } from '../utils/roles.js';

declare global {
	namespace Express {
		interface Request {
			user?: JWTPayload;
		}
	}
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
	const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');
	if (!token) {
		return res.status(401).json({ message: 'Unauthorized' });
	}
	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET as string) as JWTPayload;
		req.user = payload;
		return next();
	} catch (error) {
		return res.status(401).json({ message: 'Invalid token' });
	}
}

export function authorize(...allowed: UserRole[]) {
	return (req: Request, res: Response, next: NextFunction) => {
		if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
		if (!allowed.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
		return next();
	};
}