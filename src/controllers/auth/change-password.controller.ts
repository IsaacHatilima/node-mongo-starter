import { Request, Response, NextFunction } from 'express';
import { changePasswordSchema } from '../../schemas/auth.schema';
import { changePasswordService } from '../../services/auth/change-password.service';
import { sendResponse } from '../../utils/api-response';

export async function changePasswordController(req: Request, res: Response, next: NextFunction) {
  try {
    const data = changePasswordSchema.parse(req.body);
    await changePasswordService(req.user!.id, data);
    sendResponse(res, 200, 'Password changed successfully');
  } catch (error) {
    next(error);
  }
}
