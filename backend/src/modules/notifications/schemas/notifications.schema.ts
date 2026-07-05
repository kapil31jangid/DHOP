import { z } from 'zod';

export const createNotificationSchema = z.object({
  facilityId: z.string().uuid().optional(),
  type: z.enum(['Info', 'Warning', 'Critical']),
  title: z.string().min(1),
  message: z.string().min(1),
  isRead: z.boolean().default(false),
});
