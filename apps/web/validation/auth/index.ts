import z from 'zod';

export const loginSchema = z.object({
  email: z.email('validation.email.invalid'),
  password: z
    .string()
    .min(8, 'validation.password.tooShort')
    .max(20, 'validation.password.tooLong')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])\S+$/,
      'validation.password.weak',
    ),
});

export type LoginDto = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.email('validation.email.invalid'),
});

export type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>;

export const verifyCodeSchema = z.object({
  email: z.email('validation.email.invalid'),
  code: z.string().length(6, 'validation.code.length'),
});

export type VerifyCodeDto = z.infer<typeof verifyCodeSchema>;

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, 'validation.password.tooShort')
      .max(20, 'validation.password.tooLong')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])\S+$/,
        'validation.password.weak',
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'validation.passwords.match',
    path: ['confirmPassword'],
  });

export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;
