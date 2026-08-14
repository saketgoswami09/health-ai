import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error('Unhandled Error', err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Something went wrong',
  });
};
