import { MAX_FILE_SIZE } from '@/lib/consts';
import z from 'zod';

export const userSchema = z.object({
  firstName: z
    .string()
    .min(1, 'validation.firstName.required')
    .max(20, 'validation.firstName.tooLong'),
  middleName: z.string().max(20, 'Middle name is too long').optional(),
  lastName: z
    .string()
    .min(1, 'validation.lastName.required')
    .max(20, 'validation.lastName.tooLong'),
  phoneNumber: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || /^\+?[1-9][0-9]{7,14}$/.test(val), {
      message: 'validation.phone.invalid',
    }),
});

export const createUserSchema = userSchema.partial().extend({
  email: z.email('validation.email.invalid'),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;

export const updateUserSchema = userSchema.partial();

export type UpdateUserDto = z.infer<typeof updateUserSchema>;

export const updateProfileSchema = userSchema.partial().extend({
  profileImage: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, 'validation.file.maxSize')
    .nullable()
    .optional(),
});

export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;
