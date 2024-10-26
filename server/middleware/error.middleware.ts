import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/api-error';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  // MongoDB duplicate key error
  if (err.name === 'MongoServerError' && (err as any).code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Duplicate value entered',
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values((err as any).errors).map(
      (val: any) => val.message
    );
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: messages,
    });
  }

  // Default error
  return res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
};