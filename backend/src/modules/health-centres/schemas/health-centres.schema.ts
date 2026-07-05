import { z } from 'zod';

export const createHealthCentreSchema = z.object({
  districtId: z.string().uuid(),
  name: z.string().min(1),
  type: z.enum(['PHC', 'CHC', 'DH']),
  address: z.string().optional(),
  contactNumber: z.string().optional(),
  status: z.enum(['Active', 'Inactive']).default('Active'),
});

export const updateHealthCentreSchema = createHealthCentreSchema.partial();
