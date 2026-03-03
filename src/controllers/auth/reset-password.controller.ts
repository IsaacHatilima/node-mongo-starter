import { Request, Response, NextFunction } from 'express';
import { resetPasswordSchema } from '../../schemas/auth.schema';
import { resetPasswordService } from '../../services/auth/reset-password.service';
import { sendResponse } from '../../utils/api-response';

export async function resetPasswordController(req: Request, res: Response, next: NextFunction) {
  try {
    const data = resetPasswordSchema.parse(req.body);
    await resetPasswordService(data);
    sendResponse(res, 200, 'Password has been reset successfully');
  } catch (error) {
    next(error);
  }
}
