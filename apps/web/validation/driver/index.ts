import z from 'zod';

export const createDriverSchema = z.object({
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
  carNumber: z
    .string()
    .min(1, 'validation.carNumber.required')
    .max(10, 'validation.carNumber.tooLong'),
  rideClassId: z.string().min(1, 'Ride class is required'),
});

export type CreateDriverDto = z.infer<typeof createDriverSchema>;

export const updateDriverSchema = createDriverSchema.partial();

export type UpdateDriverDto = z.infer<typeof updateDriverSchema>;
