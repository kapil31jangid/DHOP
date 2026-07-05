import { z } from 'zod';

export const logAttendanceSchema = z.object({
  facilityId: z.string().uuid().optional(),
  userId: z.string().uuid(),
  date: z.string().optional(),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  status: z.enum(['Present', 'Absent', 'Leave']).default('Present'),
});

export const updateAttendanceSchema = logAttendanceSchema
  .partial()
  .omit({ facilityId: true, userId: true });
