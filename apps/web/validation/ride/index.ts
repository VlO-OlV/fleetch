import { LocationType, PaymentType, RideStatus } from '@/types/ride';
import z from 'zod';

export const createRideClassSchema = z.object({
  name: z
    .string()
    .min(1, 'validation.rideClass.name.required')
    .max(20, 'validation.rideClass.name.tooLong'),
  priceCoefficient: z
    .number()
    .min(1, 'validation.priceCoefficient.min')
    .max(5, 'validation.priceCoefficient.max'),
});

export type CreateRideClassDto = z.infer<typeof createRideClassSchema>;

export const updateRideClassSchema = createRideClassSchema.partial();

export type UpdateRideClassDto = z.infer<typeof updateRideClassSchema>;

export const createExtraOptionSchema = z.object({
  name: z
    .string()
    .min(1, 'validation.extraOption.name.required')
    .max(20, 'validation.extraOption.name.tooLong'),
});

export type CreateExtraOptionDto = z.infer<typeof createExtraOptionSchema>;

export const updateExtraOptionSchema = createExtraOptionSchema.partial();

export type UpdateExtraOptionDto = z.infer<typeof updateExtraOptionSchema>;

export const createRideSchema = z.object({
  driverId: z.uuid('Driver is required').optional(),
  rideClassId: z.uuid('Ride class is required'),
  clientId: z.uuid('Client is required'),
  operatorId: z.uuid('Operator is required'),
  totalPrice: z.number().min(0, 'Total price must be positive'),
  paymentType: z.enum(PaymentType, 'Payment type is required'),
  rideExtraOptionIds: z.array(z.uuid('Invalid extra options')).optional(),
  locations: z
    .array(
      z.object({
        latitude: z.number().min(-90).max(90),
        longitude: z.number().min(-180).max(180),
        address: z.string().min(1, 'validation.location.address.required'),
        type: z.enum(LocationType),
      }),
    )
    .min(2, 'validation.locations.min')
    .max(10, 'validation.locations.max'),
  scheduledAt: z
    .date()
    .optional()
    .nullable()
    .refine((date) => {
      return date ? date.getTime() > Date.now() : true;
    }, 'Scheduled time must be in the future'),
});

export type CreateRideDto = z.infer<typeof createRideSchema>;

export const updateRideSchema = createRideSchema.partial();

export type UpdateRideDto = z.infer<typeof updateRideSchema>;
