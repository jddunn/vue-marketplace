import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// @ts-ignore
interface RequestInterface extends Request {
    userId?: number;
}

const authMiddleware = (
    req: RequestInterface,
    res: Response,
    next: NextFunction,
) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    // Check to see if we have a auth token
    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
            userId: number;
        };
        req.userId = (decoded as any).userId;
        next();
    } catch (err) {
        res.status(400).send('Invalid token.');
    }
};

export default authMiddleware;
