import { z } from 'zod';
import { Role } from '../../../common/constants/roles.constants';

export const createUserSchema = z.object({
  facilityId: z.string().uuid().nullable().optional(),
  name: z.string().min(1),
  email: z.string().email(),
  role: z.nativeEnum(Role),
  password: z.string().min(6).optional(),
  firebaseUid: z.string().min(1).optional(),
  status: z.enum(['Active', 'Inactive']).default('Active'),
});

export const updateUserSchema = createUserSchema
  .partial()
  .omit({ email: true, firebaseUid: true });
