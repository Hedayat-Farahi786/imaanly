import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/api-error';
import User from '../models/user.model';

interface JwtPayload {
  userId: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new ApiError(401, 'Authentication required');
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    const user = await User.findById(decoded.userId)
      .select('-password');

    if (!user) {
      throw new ApiError(401, 'User not found');
    }

    // Update last active timestamp
    user.lastActive = new Date();
    await user.save();

    req.user = user;
    next();
  } catch (error) {
    next(new ApiError(401, 'Invalid or expired token'));
  }
};