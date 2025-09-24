import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    // console.log(`📥 ${req.method} ${req.originalUrl}`);
    console.log(`📥 [${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);

    next();
};