import { z } from 'zod';

export const createSettingSchema = z.object({
  facilityId: z.string().uuid().optional(),
  key: z.string().min(1),
  value: z.string().min(1),
});

export const updateSettingSchema = createSettingSchema.partial().omit({ facilityId: true });
