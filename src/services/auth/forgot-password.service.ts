import crypto from 'crypto';
import { prisma } from '../../config/prisma';
import { ForgotPasswordInput } from '../../schemas/auth.schema';
import { sendPasswordResetEmail } from '../../utils/email';

export async function forgotPasswordService(input: ForgotPasswordInput) {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  // Always return silently to prevent email enumeration
  if (!user) return;

  // Delete any existing reset tokens for this user
  await prisma.passwordReset.deleteMany({
    where: { userId: user.id },
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

  await sendPasswordResetEmail(user.email, rawToken);
}
