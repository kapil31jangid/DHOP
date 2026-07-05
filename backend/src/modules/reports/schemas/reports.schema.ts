import { z } from 'zod';

export const generateReportSchema = z.object({
  facilityId: z.string().uuid().nullable().optional(),
  reportType: z.enum(['Daily', 'Weekly', 'Monthly', 'Inventory', 'Attendance']),
  fileUrl: z.string().url().optional(),
  status: z.enum(['Pending', 'Completed', 'Failed']).default('Completed'),
});
