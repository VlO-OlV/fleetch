import { LocationType, PaymentType, RideStatus } from '@/types/ride';
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
        address: z.string().min(1, 'Address must be specified'),
        type: z.enum(LocationType),
      }),
    )
    .min(2, 'At least start and end locations are required')
    .max(10, 'Only up to 10 locations can be specified'),
  scheduledAt: z.date().optional(),
});

export type CreateRideDto = z.infer<typeof createRideSchema>;

export const updateRideSchema = createRideSchema.partial();

export type UpdateRideDto = z.infer<typeof updateRideSchema>;
