import { Response } from 'express';

export function sendResponse<T = unknown>(
  res: Response,
  statusCode: number,
  message: string,
  data: T = [] as unknown as T
): void {
  res.status(statusCode).json({
    message,
    data,
    errors: [],
    status: statusCode,
  });
}
