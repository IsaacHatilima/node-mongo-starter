import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { prisma } from '../../config/prisma';
import { AppError } from '../../utils/api-error';
import { ResetPasswordInput } from '../../schemas/auth.schema';

export async function resetPasswordService(input: ResetPasswordInput) {
  const hashedToken = crypto.createHash('sha256').update(input.token).digest('hex');

  const passwordReset = await prisma.passwordReset.findFirst({
    where: {
      token: hashedToken,
      used: false,
      expiresAt: { gt: new Date() },
    },
  });

  if (!passwordReset) {
    throw new AppError('Invalid or expired reset token', 400);
  }

  const hashedPassword = await bcrypt.hash(input.password, 12);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: passwordReset.userId },
      data: { password: hashedPassword },
    }),
    prisma.passwordReset.update({
      where: { id: passwordReset.id },
      data: { used: true },
    }),
  ]);
}
