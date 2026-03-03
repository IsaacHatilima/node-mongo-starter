import crypto from 'crypto';
import { prisma } from '../../config/prisma';
import { ForgotPasswordInput } from '../../schemas/auth.schema';

export async function forgotPasswordService(input: ForgotPasswordInput) {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  // Always return silently to prevent email enumeration
  if (!user) return;

  // Invalidate any existing unused reset tokens
  await prisma.passwordReset.updateMany({
    where: { userId: user.id, used: false },
    data: { used: true },
  });

  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

  await prisma.passwordReset.create({
    data: {
      token: hashedToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    },
  });

  // TODO: In production, send rawToken via email instead of logging
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DEV] Password reset token for ${input.email}: ${rawToken}`);
  }
}
