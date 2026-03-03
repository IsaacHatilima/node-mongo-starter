import { Router } from 'express';
import { loginController } from '../../controllers/auth/login.controller';
import { registerController } from '../../controllers/auth/register.controller';
import { forgotPasswordController } from '../../controllers/auth/forgot-password.controller';
import { resetPasswordController } from '../../controllers/auth/reset-password.controller';
import { changePasswordController } from '../../controllers/auth/change-password.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.post('/forgot-password', forgotPasswordController);
router.post('/reset-password', resetPasswordController);
router.post('/change-password', authenticate, changePasswordController);

export { router as authRouter };
