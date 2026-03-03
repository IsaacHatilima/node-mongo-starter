import { Request, Response, NextFunction } from 'express';
import { forgotPasswordSchema } from '../../schemas/auth.schema';
import { forgotPasswordService } from '../../services/auth/forgot-password.service';
import { sendResponse } from '../../utils/api-response';

export async function forgotPasswordController(req: Request, res: Response, next: NextFunction) {
  try {
    const data = forgotPasswordSchema.parse(req.body);
    await forgotPasswordService(data);
    sendResponse(
      res,
      200,
      'If an account with that email exists, a password reset link has been sent'
    );
  } catch (error) {
    next(error);
  }
}
