import { Request, Response, NextFunction } from 'express';
import { loginSchema } from '../../schemas/auth.schema';
import { loginService } from '../../services/auth/login.service';
import { sendResponse } from '../../utils/api-response';
import { setAuthCookies } from '../../utils/token';
import { env } from '../../config/env';

export async function loginController(req: Request, res: Response, next: NextFunction) {
  try {
    const data = loginSchema.parse(req.body);
    const result = await loginService(data);

    const isRemote = req.headers[env.REMOTE_CLIENT_HEADER] === env.REMOTE_CLIENT_VALUE;

    if (isRemote) {
      sendResponse(res, 200, 'Login successful', {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });
    } else {
      setAuthCookies(res, result.accessToken, result.refreshToken);
      sendResponse(res, 200, 'Login successful', { user: result.user });
    }
  } catch (error) {
    next(error);
  }
}
