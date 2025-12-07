import z from 'zod';

export const createClientSchema = z.object({
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

export type CreateClientDto = z.infer<typeof createClientSchema>;

export const updateClientSchema = createClientSchema.partial();

export type UpdateClientDto = z.infer<typeof updateClientSchema>;
