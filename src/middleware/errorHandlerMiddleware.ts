import { Request, Response, NextFunction } from 'express';

const errorHandlerMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {

    console.error(err);

    if (res.headersSent) {
        return next(err);
    }

    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? '' : err.stack
    });
    
};

export default errorHandlerMiddleware;
