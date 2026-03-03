import { Request, Response, NextFunction } from 'express';
import { sendResponse } from '../../utils/api-response';

export async function meController(req: Request, res: Response, next: NextFunction) {
  try {
    sendResponse(res, 200, 'User retrieved successfully', { user: req.user });
  } catch (error) {
    next(error);
  }
}
