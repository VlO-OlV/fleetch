import z from 'zod';

export const createClientSchema = z.object({
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

export type CreateClientDto = z.infer<typeof createClientSchema>;

export const updateClientSchema = createClientSchema.partial();

export type UpdateClientDto = z.infer<typeof updateClientSchema>;
