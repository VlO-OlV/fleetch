import { MAX_FILE_SIZE } from '@/lib/consts';
import z from 'zod';

export const userSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(20, 'First name is too long'),
  middleName: z.string().max(20, 'Middle name is too long').optional(),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(20, 'Last name is too long'),
  phoneNumber: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || /^\+?[1-9][0-9]{7,14}$/.test(val), {
      message: 'Invalid phone number',
    }),
});

export const createUserSchema = userSchema.partial().extend({
  email: z.email('Invalid email address'),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;

export const updateUserSchema = userSchema.partial();

export type UpdateUserDto = z.infer<typeof updateUserSchema>;

export const updateProfileSchema = userSchema.partial().extend({
  profileImage: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, 'Max file size is 5MB')
    .nullable()
    .optional(),
});

export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;
