import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later",
});

export const rateLimiter = (endpoints: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (endpoints.includes(req.path)) {
      return apiLimiter(req, res, next);
    }
    next();
  };
};
