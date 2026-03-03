import { Request, Response, NextFunction } from 'express';
import { registerSchema } from '../../schemas/auth.schema';
import { registerService } from '../../services/auth/register.service';
import { sendResponse } from '../../utils/api-response';

export async function registerController(req: Request, res: Response, next: NextFunction) {
  try {
    const data = registerSchema.parse(req.body);
    const user = await registerService(data);
    sendResponse(res, 201, 'Registration successful', { user });
  } catch (error) {
    next(error);
  }
}
