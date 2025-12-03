import { z } from 'zod';

export const driverFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().optional(),
  rideClass: z.string().optional(),
  carNumber: z.string().optional(),
  status: z.enum(['active', 'inactive', 'suspended']).optional(),
});

export type DriverFormValues = z.infer<typeof driverFormSchema>;
