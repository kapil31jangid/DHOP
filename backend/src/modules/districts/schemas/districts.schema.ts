import { z } from 'zod';

export const createDistrictSchema = z.object({
  name: z.string().min(1),
  state: z.string().min(1),
  status: z.enum(['Active', 'Inactive']).default('Active'),
});

export const updateDistrictSchema = createDistrictSchema.partial();
