import { z } from 'zod';

export const clientFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  middleName: z.string().optional(),
  phone: z.string().min(1, 'Phone number is required'),
});

export type ClientFormValues = z.infer<typeof clientFormSchema>;
