import { z } from 'zod';

export const operatorFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Invalid email'),
  state: z.enum(['active', 'inactive', 'suspended']),
});

export type OperatorFormValues = z.infer<typeof operatorFormSchema>;
