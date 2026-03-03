import bcrypt from 'bcryptjs';
import { prisma } from '../../config/prisma';
import { AppError } from '../../utils/api-error';
import { ChangePasswordInput } from '../../schemas/auth.schema';

export async function changePasswordService(userId: string, input: ChangePasswordInput) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const isValidPassword = await bcrypt.compare(input.currentPassword, user.password);

  if (!isValidPassword) {
    throw new AppError('Current password is incorrect', 401);
  }

  if (input.currentPassword === input.newPassword) {
    throw new AppError('New password must be different from current password', 400);
  }

  const hashedPassword = await bcrypt.hash(input.newPassword, 12);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });
}
