import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/api-error';
import { env } from '../config/env';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      message: err.message,
      data: [],
      errors: err.errors,
      status: err.statusCode,
    });
    return;
  }

  if (err instanceof ZodError) {
    const errors = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
    res.status(422).json({
      message: 'Validation failed',
      data: [],
      errors,
      status: 422,
    });
    return;
  }

  const statusCode = 500;
  res.status(statusCode).json({
    message: 'Internal server error',
    data: [],
    errors: env.NODE_ENV === 'development' ? [err.message] : [],
    status: statusCode,
  });
}

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({
    message: 'Resource not found',
    data: [],
    errors: [],
    status: 404,
  });
}
