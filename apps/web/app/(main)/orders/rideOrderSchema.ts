import { z } from 'zod';

export const rideOrderSchema = z.object({
  clientId: z.string().min(1, 'Client is required'),
  driverId: z.string().min(1, 'Driver is required'),
  rideClass: z.string().min(1, 'Ride class is required'),
  extraOptions: z.array(z.string()).optional(),
  paymentType: z.string().min(1, 'Payment type is required'),
  locations: z
    .array(
      z.object({
        address: z.string().min(1, 'Location is required'),
      }),
    )
    .min(2, 'At least start and end locations required'),
  scheduled: z.boolean().optional(),
  scheduledDate: z.date().optional(),
});

export type RideOrderFormValues = z.infer<typeof rideOrderSchema>;
