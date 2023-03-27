import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
    user: {
        id: number;
        username: string;
        email: string;
    }
}

const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // get the token from the request headers
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  // if no token is provided, return 401 unauthorized
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // verify the token using the secret key
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY as string);

    // add the decoded token to the request object for use in future middleware or routes
    req.user = decodedToken;

    // call next to move on to the next middleware or route
    next();
  } catch (err) {
    // if token is invalid, return 401 unauthorized
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export default authMiddleware;
