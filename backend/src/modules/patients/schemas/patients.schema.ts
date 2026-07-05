import { z } from 'zod';

export const createPatientSchema = z.object({
  facilityId: z.string().uuid().optional(), // Can be injected from current user facility scope
  patientIdCode: z.string().min(1),
  name: z.string().min(1),
  age: z.number().int().min(0),
  gender: z.string().min(1),
  visitType: z.enum(['OPD', 'IPD']),
  diseaseCategory: z.string().optional(),
  assignedDoctor: z.string().optional(),
  visitDate: z.string().optional(), // Default: current date
});

export const updatePatientSchema = createPatientSchema.partial().omit({ facilityId: true });
export type CreatePatientInput = z.infer<typeof createPatientSchema>;
export type UpdatePatientInput = z.infer<typeof updatePatientSchema>;
