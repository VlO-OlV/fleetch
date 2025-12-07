import z from 'zod';

export const createRideClassSchema = z.object({
  name: z
    .string()
    .min(1, 'Ride class name is required')
    .max(20, 'Ride class name is too long'),
  priceCoefficient: z
    .number()
    .min(1, 'Price coefficient must be at least 1')
    .max(5, 'Price coefficient is too high'),
});

export type CreateRideClassDto = z.infer<typeof createRideClassSchema>;

export const updateRideClassSchema = createRideClassSchema.partial();

export type UpdateRideClassDto = z.infer<typeof updateRideClassSchema>;

export const createExtraOptionSchema = z.object({
  name: z
    .string()
    .min(1, 'Extra option name is required')
    .max(20, 'Extra option name is too long'),
});

export type CreateExtraOptionDto = z.infer<typeof createExtraOptionSchema>;

export const updateExtraOptionSchema = createExtraOptionSchema.partial();

export type UpdateExtraOptionDto = z.infer<typeof updateExtraOptionSchema>;
