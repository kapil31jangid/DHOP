import { z } from 'zod';

export const createMedicineSchema = z.object({
  facilityId: z.string().uuid().optional(),
  name: z.string().min(1),
  category: z.string().optional(),
  batchNumber: z.string().min(1),
  expiryDate: z.string().min(1),
  quantity: z.number().int().min(0).default(0),
  threshold: z.number().int().min(0).default(0),
});

export const updateMedicineSchema = createMedicineSchema.partial().omit({ facilityId: true });
