import { z } from 'zod';

export const createBedSchema = z.object({
  facilityId: z.string().uuid().optional(),
  bedNumber: z.string().min(1),
  ward: z.string().min(1),
  bedType: z.enum(['General', 'ICU', 'Oxygen']),
  status: z.enum(['Available', 'Occupied', 'Maintenance']).default('Available'),
  assignedPatientId: z.string().uuid().nullable().optional(),
});

export const updateBedSchema = createBedSchema.partial().omit({ facilityId: true });
